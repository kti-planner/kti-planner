import type { APIRoute } from 'astro';
import { checkForEventConflicts } from '@backend/calendar-checks';
import { CalendarEvent } from '@backend/calendar-events';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { LaboratoryClass } from '@backend/laboratory-class';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';
import { calendarEventEditApiSchema } from '@components/calendar-events/types';

export const PATCH: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const semester = await Semester.fetch(params.semesterId ?? '');
    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const calendarEvent = await CalendarEvent.fetch(params.eventId ?? '');
    if (!calendarEvent || calendarEvent.semesterId !== semester.id) {
        return Response.json(null, { status: 404 });
    }

    const data = calendarEventEditApiSchema.nullable().catch(null).parse(jsonData);
    if (!data) {
        return Response.json(null, { status: 400 });
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

export const DELETE: APIRoute = async ({ locals, params }) => {
    const { user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const semester = await Semester.fetch(params.semesterId ?? '');

    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const calendarEvent = await CalendarEvent.fetch(params.eventId ?? '');

    if (!calendarEvent || calendarEvent.semesterId !== semester.id) {
        return Response.json(null, { status: 404 });
    }

    await calendarEvent.delete();

    return Response.json(true, { status: 200 });
};
