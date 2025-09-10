import type { APIRoute } from 'astro';
import { Semester } from '@backend/semester';
import { scheduleChangeDataSchema } from '@components/semesters/types';

export const PUT: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const semester = await Semester.fetchBySlug(params.semesterSlug ?? '');

    if (!semester) {
        return Response.json(null, { status: 400 });
    }

    const data = scheduleChangeDataSchema.array().nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    await semester.setScheduleChanges(data);

    return Response.json(true, { status: 200 });
};
