import type { APIRoute } from 'astro';
import z from 'zod';
import { Classroom } from '@backend/classroom';

const schema = z.object({
    name: z.string().trim().nonempty(),
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

    const classrooms = await Classroom.fetchAll();
    if (classrooms.some(c => c.name === data.name)) {
        return Response.json(false, { status: 200 });
    }

    await Classroom.create({
        name: data.name,
    });

    return Response.json(true, { status: 201 });
};

const schemaEdit = z.object({
    id: z.uuid(),
    name: z.string().trim().nonempty().optional(),
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

    const classroom = await Classroom.fetch(data.id);

    if (classroom === null) {
        return Response.json(null, { status: 404 });
    }

    const classrooms = await Classroom.fetchAll();
    const otherClassroom = classrooms.find(c => c.name === data.name);

    if (otherClassroom && otherClassroom.id !== data.id) {
        return Response.json(false, { status: 200 });
    }

    await classroom.edit({
        name: data.name,
    });

    return Response.json(true, { status: 200 });
};
