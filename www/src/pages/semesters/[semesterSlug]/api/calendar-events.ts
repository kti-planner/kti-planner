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

    const classroom =
        data.classroomId !== undefined && data.classroomId !== null
            ? await Classroom.fetch(data.classroomId)
            : data.classroomId;

    if (data.classroomId !== null && classroom === null) {
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
