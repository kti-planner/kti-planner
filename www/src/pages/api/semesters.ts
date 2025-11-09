import type { APIRoute } from 'astro';
import { makeSemesterData, Semester } from '@backend/semester';
import { semesterCreateApiSchema } from '@components/semesters/types';

export const GET: APIRoute = async ({ locals }) => {
    const { user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const semesters = await Semester.fetchAll();

    return Response.json(
        semesters.map(semester => makeSemesterData(semester)),
        { status: 200 },
    );
};

export const POST: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = semesterCreateApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    if (await Semester.fetchByYearAndType(data.year, data.type)) {
        return Response.json(false, { status: 200 });
    }

    await Semester.create(data);

    return Response.json(true, { status: 201 });
};
