import type { APIRoute } from 'astro';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { semesterEditApiSchema } from '@components/semesters/types';

export const PATCH: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const semester = await Semester.fetch(params.semesterId ?? '');

    if (semester === null) {
        return Response.json(null, { status: 404 });
    }

    const data = semesterEditApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const other = await Semester.fetchByYearAndType(data.year ?? semester.year, data.type ?? semester.type);

    if (other && other.id !== semester.id) {
        return Response.json(false, { status: 200 });
    }

    await semester.edit(data);

    return Response.json(true, { status: 200 });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
    const { user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const semester = await Semester.fetch(params.semesterId ?? '');

    if (!semester) {
        return Response.json(null, { status: 404 });
    }

    if ((await Subject.fetchAllFromSemester(semester)).length > 0) {
        return Response.json(false, { status: 200 });
    }

    await semester.delete();

    return Response.json(true, { status: 200 });
};
