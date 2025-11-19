import type { APIRoute } from 'astro';
import { checkForEventConflicts, type EventSlot } from '@backend/calendar-checks';
import { CalendarEvent, makeCalendarEventData } from '@backend/calendar-events';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { LaboratoryClass } from '@backend/laboratory-class';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';
import { calendarEventCreateApiSchema, type CalendarEventData } from '@components/calendar-events/types';

export const GET: APIRoute = async ({ params, url }) => {
    const { semesterId } = params;
    if (semesterId === undefined) {
        return new Response(null, { status: 404 });
    }

    const semester = await Semester.fetch(semesterId);
    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const classroomFilter = url.searchParams.getAll('classroom');
    const teacherFilter = url.searchParams.getAll('teacher');
    const typeFilter = url.searchParams.getAll('type');

    const calendarEvents = await CalendarEvent.fetchAllFromSemester(semester);
    const users = await User.fetchAll();
    const classrooms = await Classroom.fetchAll();

    return Response.json(
        calendarEvents
            .map<CalendarEventData | null>(calendarEvent => {
                const user = users.find(u => u.id === calendarEvent.userId) ?? null;
                const classroom = classrooms.find(c => c.id === calendarEvent.classroomId) ?? null;

                if (calendarEvent.type !== 'classes-canceled') {
                    if (
                        teacherFilter.length > 0 &&
                        (calendarEvent.userId === null || !teacherFilter.includes(calendarEvent.userId))
                    ) {
                        return null;
                    }

                    if (classroomFilter.length > 0 && !classroomFilter.includes(String(calendarEvent.classroomId))) {
                        return null;
                    }
                }

                if (typeFilter.length > 0 && !typeFilter.includes(calendarEvent.type)) {
                    return null;
                }

                return makeCalendarEventData(calendarEvent, user, classroom, semester);
            })
            .filter(data => data !== null) satisfies CalendarEventData[],
    );
};

export const POST: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;
    const { semesterId } = params;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    if (semesterId === undefined) {
        return new Response(null, { status: 404 });
    }

    const semester = await Semester.fetch(semesterId);
    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const data = calendarEventCreateApiSchema.nullable().catch(null).parse(jsonData);
    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const classroom = data.classroomId !== null ? await Classroom.fetch(data.classroomId) : null;
    if (data.classroomId !== null && !classroom) {
        return new Response(null, { status: 400 });
    }

    const eventUser = await User.fetch(data.userId);
    if (!eventUser) {
        return new Response(null, { status: 400 });
    }

    const slots = data.durations.map<EventSlot>(({ startDate, endDate }) => ({
        id: null,
        classroomId: classroom?.id ?? null,
        startDate,
        endDate,
    }));

    const scheduleChanges = await semester.getScheduleChanges();
    const subjects = await Subject.fetchAllFromSemester(semester);
    const laboratoryClasses = await LaboratoryClass.fetchAllFromSubjects(subjects);
    const exercises = await Exercise.fetchAllFromSubjects(subjects);
    const calendarEvents = await CalendarEvent.fetchAllFromSemester(semester);

    const conflicts = checkForEventConflicts(
        slots,
        semester,
        scheduleChanges,
        laboratoryClasses,
        exercises,
        calendarEvents,
    );

    if (conflicts.length > 0) {
        return Response.json(conflicts);
    }

    await Promise.all(
        data.durations.map(({ startDate, endDate }) =>
            CalendarEvent.create({
                name: data.name,
                user: eventUser,
                classroom,
                semester,
                startDate,
                endDate,
                type: data.type,
                color: data.color,
            }),
        ),
    );

    return Response.json([]);
};
