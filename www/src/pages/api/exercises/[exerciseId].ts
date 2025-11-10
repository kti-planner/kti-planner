import type { APIRoute } from 'astro';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';
import { exerciseEditApiSchema } from '@components/exercises/types';

export const PATCH: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const exercise = await Exercise.fetch(params.exerciseId ?? '');
    if (exercise === null) {
        return Response.json(null, { status: 404 });
    }

    const data = exerciseEditApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const classroom =
        data.classroomId !== undefined && data.classroomId !== null
            ? await Classroom.fetch(data.classroomId)
            : data.classroomId;

    if (data.classroomId !== null && classroom === null) {
        return Response.json(null, { status: 400 });
    }

    const teacher = data.teacherId === undefined ? undefined : await User.fetch(data.teacherId);

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

export const DELETE: APIRoute = async ({ locals, params }) => {
    const { user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const exercise = await Exercise.fetch(params.exerciseId ?? '');

    if (!exercise) {
        return Response.json(null, { status: 404 });
    }

    await exercise.delete();

    return Response.json(true, { status: 200 });
};
