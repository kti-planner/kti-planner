import type { APIRoute } from 'astro';
import { Classroom } from '@backend/classroom';
import { classroomCreateApiSchema } from '@components/classrooms/types';

export const POST: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = classroomCreateApiSchema.nullable().catch(null).parse(jsonData);

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
