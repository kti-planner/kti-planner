import type { APIRoute } from 'astro';
import { makeSemesterData, Semester } from '@backend/semester';
import { semesterCreateApiSchema, semesterEditApiSchema } from '@components/semesters/types';

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

export const PATCH: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = semesterEditApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const semester = await Semester.fetch(data.id);

    if (semester === null) {
        return Response.json(null, { status: 404 });
    }

    const other = await Semester.fetchByYearAndType(data.year ?? semester.year, data.type ?? semester.type);

    if (other && other.id !== semester.id) {
        return Response.json(false, { status: 200 });
    }

    await semester.edit(data);

    return Response.json(true, { status: 200 });
};

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
