import type { APIRoute } from 'astro';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';
import { exerciseCreateApiSchema, exerciseEditApiSchema } from '@components/exercises/types';

export const POST: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = exerciseCreateApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const classroom = data.classroomId !== null ? await Classroom.fetch(data.classroomId) : null;

    const subject = await Subject.fetch(data.subjectId);

    if (subject === null) {
        return Response.json(false, { status: 404 });
    }

    const teacher = data.teacherId !== null ? await User.fetch(data.teacherId) : null;

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
        teacher: teacher,
    });

    return Response.json(true, { status: 201 });
};

export const PATCH: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = exerciseEditApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const exercise = await Exercise.fetch(data.id);

    if (exercise === null) {
        return Response.json(null, { status: 404 });
    }

    const classroom =
        data.classroomId === undefined
            ? undefined
            : data.classroomId === null
              ? null
              : await Classroom.fetch(data.classroomId);

    const teacher =
        data.teacherId === undefined ? undefined : data.teacherId === null ? null : await User.fetch(data.teacherId);

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
        teacher: teacher,
    });

    return Response.json(true, { status: 200 });
};
