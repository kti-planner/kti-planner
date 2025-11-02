import type { APIRoute } from 'astro';
import { checkForEventConflicts, type EventSlot } from '@backend/calendar-checks';
import { CalendarEvent, makeCalendarEventData } from '@backend/calendar-events';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { LaboratoryClass } from '@backend/laboratory-class';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';
import {
    calendarEventCreateApiSchema,
    type CalendarEventData,
    calendarEventEditApiSchema,
} from '@components/calendar-events/types';

export const GET: APIRoute = async ({ params, url }) => {
    const { semesterSlug } = params;
    if (semesterSlug === undefined) {
        return new Response(null, { status: 404 });
    }

    const semester = await Semester.fetchBySlug(semesterSlug);
    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const classroomFilter = url.searchParams.getAll('classroom');
    const teacherFilter = url.searchParams.getAll('teacher');

    const calendarEvents = await CalendarEvent.fetchAllFromSemester(semester);
    const users = await User.fetchAll();
    const classrooms = await Classroom.fetchAll();

    return Response.json(
        calendarEvents
            .map<CalendarEventData | null>(calendarEvent => {
                const user = users.find(u => u.id === calendarEvent.userId) ?? null;
                const classroom = classrooms.find(c => c.id === calendarEvent.classroomId) ?? null;

                if (
                    teacherFilter.length > 0 &&
                    (calendarEvent.userId === null || !teacherFilter.includes(calendarEvent.userId))
                ) {
                    return null;
                }

                if (classroomFilter.length > 0 && !classroomFilter.includes(String(calendarEvent.classroomId))) {
                    return null;
                }

                return makeCalendarEventData(calendarEvent, user, classroom, semester);
            })
            .filter(data => data !== null) satisfies CalendarEventData[],
    );
};

export const POST: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;
    const { semesterSlug } = params;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    if (semesterSlug === undefined) {
        return new Response(null, { status: 404 });
    }

    const semester = await Semester.fetchBySlug(semesterSlug);
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
            }),
        ),
    );

    return Response.json([]);
};

export const PATCH: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;
    const { semesterSlug } = params;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    if (semesterSlug === undefined) {
        return new Response(null, { status: 404 });
    }

    const semester = await Semester.fetchBySlug(semesterSlug);
    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const data = calendarEventEditApiSchema.nullable().catch(null).parse(jsonData);
    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const calendarEvent = await CalendarEvent.fetch(data.id);
    if (!calendarEvent) {
        return Response.json(null, { status: 404 });
    }

    const classroom =
        data.classroomId !== undefined && data.classroomId !== null
            ? await Classroom.fetch(data.classroomId)
            : data.classroomId;

    if (data.classroomId !== null && classroom === null) {
        return Response.json(null, { status: 400 });
    }

    const eventUser = data.userId !== undefined ? await User.fetch(data.userId) : undefined;
    if (eventUser === null) {
        return Response.json(null, { status: 400 });
    }

    const scheduleChanges = await semester.getScheduleChanges();
    const subjects = await Subject.fetchAllFromSemester(semester);
    const laboratoryClasses = await LaboratoryClass.fetchAllFromSubjects(subjects);
    const exercises = await Exercise.fetchAllFromSubjects(subjects);
    const calendarEvents = await CalendarEvent.fetchAllFromSemester(semester);

    const conflicts = checkForEventConflicts(
        [
            {
                id: calendarEvent.id,
                classroomId: classroom !== undefined ? (classroom?.id ?? null) : calendarEvent.classroomId,
                startDate: data.startDate ?? calendarEvent.startDate,
                endDate: data.endDate ?? calendarEvent.endDate,
            },
        ],
        semester,
        scheduleChanges,
        laboratoryClasses,
        exercises,
        calendarEvents,
    );

    if (conflicts.length > 0) {
        return Response.json(conflicts);
    }

    await calendarEvent.edit({
        name: data.name,
        user: eventUser,
        classroom: classroom,
        startDate: data.startDate,
        endDate: data.endDate,
    });

    return Response.json([]);
};

export const DELETE: APIRoute = async ({ locals, url, params }) => {
    const { user } = locals;
    const { semesterSlug } = params;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    if (semesterSlug === undefined) {
        return new Response(null, { status: 404 });
    }

    const semester = await Semester.fetchBySlug(semesterSlug);

    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const id = url.searchParams.get('id');

    if (id === null) {
        return Response.json(null, { status: 400 });
    }

    const calendarEvent = await CalendarEvent.fetch(id);

    if (!calendarEvent || calendarEvent.semesterId !== semester.id) {
        return Response.json(null, { status: 404 });
    }

    await calendarEvent.delete();

    return Response.json(true, { status: 200 });
};
