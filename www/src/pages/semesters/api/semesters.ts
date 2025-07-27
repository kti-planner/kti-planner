import type { APIRoute } from 'astro';
import { z } from 'zod';
import { Semester } from '@backend/semester';

const schema = z.object({
    year: z.number(),
    type: z.enum(['summer', 'winter']),
    startDate: z.iso.date().transform(str => {
        return new Date(`${str}T00:00:00`);
    }),
    endDate: z.iso.date().transform(str => {
        return new Date(`${str}T00:00:00`);
    }),
});

export const POST: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = schema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    if (await Semester.fetchByYearAndType(data.year, data.type)) {
        return Response.json(false, { status: 200 });
    }

    await Semester.create(data);

    return Response.json(true, { status: 201 });
};

const schemaEdit = z.object({
    id: z.uuid(),
    year: z.number().optional(),
    type: z.enum(['summer', 'winter']).optional(),
    startDate: z.iso
        .date()
        .transform(str => {
            return new Date(`${str}T00:00:00`);
        })
        .optional(),
    endDate: z.iso
        .date()
        .transform(str => {
            return new Date(`${str}T00:00:00`);
        })
        .optional(),
});

export const PATCH: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = schemaEdit.nullable().catch(null).parse(jsonData);

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
