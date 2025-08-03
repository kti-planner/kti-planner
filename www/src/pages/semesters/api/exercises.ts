import type { APIRoute } from 'astro';
import { z } from 'zod';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { Subject } from '@backend/subject';

const schema = z.object({
    name: z.string().trim().nonempty(),
    exerciseNumber: z.number(),
    subjectId: z.uuid(),
    classroomId: z.uuid(),
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

    const classroom = await Classroom.fetch(data.classroomId);

    if (classroom === null) {
        return Response.json(false, { status: 404 });
    }

    const subject = await Subject.fetch(data.subjectId);

    if (subject === null) {
        return Response.json(false, { status: 404 });
    }

    const subjectExercises = await Exercise.fetchAllFromSubject(subject);

    if (subjectExercises.find(e => e.name.toLowerCase() === data.name.toLowerCase())) {
        return Response.json(false, { status: 200 });
    }

    if (subjectExercises.find(e => e.exerciseNumber === data.exerciseNumber)) {
        return Response.json(false, { status: 200 });
    }

    await Exercise.create({
        name: data.name,
        exerciseNumber: data.exerciseNumber,
        subject: subject,
        classroom: classroom,
    });

    return Response.json(true, { status: 201 });
};

const schemaEdit = z.object({
    id: z.uuid(),
    name: z.string().optional(),
    exerciseNumber: z.number().optional(),
    classroomId: z.uuid().optional(),
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

    const exercise = await Exercise.fetch(data.id);

    if (exercise === null) {
        return Response.json(null, { status: 404 });
    }

    const classroom = data.classroomId === undefined ? undefined : await Classroom.fetch(data.classroomId);

    if (classroom === null) {
        return Response.json(false, { status: 404 });
    }

    const subject = await Subject.fetch(exercise.subjectId);

    if (subject === null) {
        return Response.json(null, { status: 404 });
    }

    const subjectExercises = await Exercise.fetchAllFromSubject(subject);

    let otherExercise = subjectExercises.find(e => e.name.toLowerCase() === data.name?.toLowerCase());

    if (otherExercise && otherExercise.id !== exercise.id) {
        return Response.json(false, { status: 200 });
    }

    otherExercise = subjectExercises.find(e => e.exerciseNumber === data.exerciseNumber);

    if (otherExercise && otherExercise.id !== exercise.id) {
        return Response.json(false, { status: 200 });
    }

    await exercise.edit({
        name: data.name,
        exerciseNumber: data.exerciseNumber,
        classroom: classroom,
    });

    return Response.json(true, { status: 200 });
};
