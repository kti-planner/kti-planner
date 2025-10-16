import assert from 'node:assert';
import type { APIRoute } from 'astro';
import { CalendarEvent, makeCalendarEventData } from '@backend/calendar-events';
import { Classroom } from '@backend/classroom';
import { Semester } from '@backend/semester';
import { User } from '@backend/user';
import {
    calendarEventCreateApiSchema,
    type CalendarEventData,
    calendarEventEditApiSchema,
} from '@components/calendar-events/types';

export const GET: APIRoute = async ({ params }) => {
    const { semesterSlug } = params;
    if (semesterSlug === undefined) {
        return new Response(null, { status: 404 });
    }

    const semester = await Semester.fetchBySlug(semesterSlug);
    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const calendarEvents = await CalendarEvent.fetchAllFromSemester(semester);
    const users = await User.fetchAll();
    const classrooms = await Classroom.fetchAll();

    return Response.json(
        calendarEvents.map(calendarEvent => {
            const user = users.find(u => u.id === calendarEvent.userId);
            assert(user);

            const classroom = classrooms.find(c => c.id === calendarEvent.classroomId);
            assert(classroom);

            return makeCalendarEventData(calendarEvent, user, classroom, semester);
        }) satisfies CalendarEventData[],
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

    const classroom = await Classroom.fetch(data.classroomId);
    if (!classroom) {
        return new Response(null, { status: 400 });
    }

    await Promise.all(
        data.durations.map(({ startDate, endDate }) =>
            CalendarEvent.create({
                name: data.name,
                user,
                classroom,
                semester,
                startDate,
                endDate,
            }),
        ),
    );

    return Response.json(true, { status: 201 });
};

export const PATCH: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = calendarEventEditApiSchema.nullable().catch(null).parse(jsonData);
    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const calendarEvent = await CalendarEvent.fetch(data.id);
    if (!calendarEvent) {
        return Response.json(null, { status: 404 });
    }

    const classroom = data.classroomId !== undefined ? await Classroom.fetch(data.classroomId) : undefined;
    if (classroom === null) {
        return Response.json(null, { status: 400 });
    }

    await calendarEvent.edit({
        name: data.name,
        classroom: classroom,
        startDate: data.startDate,
        endDate: data.endDate,
    });

    return Response.json(true);
};
