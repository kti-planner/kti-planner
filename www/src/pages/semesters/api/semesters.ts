import type { APIRoute } from 'astro';
import { z } from 'zod';
import { Semester } from '@backend/semester';

const schema = z.object({
    year: z.number(),
    type: z.enum(['summer', 'winter']),
    startDate: z
        .string()
        .date()
        .transform(str => {
            return new Date(`${str}T00:00:00`);
        }),
    endDate: z
        .string()
        .date()
        .transform(str => {
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

    try {
        await Semester.create(data);
        return Response.json(true, { status: 201 });
    } catch {
        return Response.json(false, { status: 200 });
    }
};
