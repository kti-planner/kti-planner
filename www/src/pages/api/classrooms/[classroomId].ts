import type { APIRoute } from 'astro';
import { Classroom } from '@backend/classroom';
import { classroomEditApiSchema } from '@components/classrooms/types';

export const PATCH: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const classroom = await Classroom.fetch(params.classroomId ?? '');

    if (classroom === null) {
        return Response.json(null, { status: 404 });
    }

    const data = classroomEditApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const classrooms = await Classroom.fetchAll();
    const otherClassroom = classrooms.find(c => c.name === data.name);

    if (otherClassroom && otherClassroom.id !== classroom.id) {
        return Response.json(false, { status: 200 });
    }

    await classroom.edit({
        name: data.name,
    });

    return Response.json(true, { status: 200 });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
    const { user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const classroom = await Classroom.fetch(params.classroomId ?? '');

    if (!classroom) {
        return Response.json(null, { status: 404 });
    }

    await classroom.delete();

    return Response.json(true, { status: 200 });
};
