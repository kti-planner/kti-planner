import type { APIRoute } from 'astro';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';
import { exerciseCreateApiSchema } from '@components/exercises/types';

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
    if (data.classroomId !== null && !classroom) {
        return new Response(null, { status: 400 });
    }

    const subject = await Subject.fetch(data.subjectId);
    if (subject === null) {
        return Response.json(false, { status: 404 });
    }

    const teacher = await User.fetch(data.teacherId);

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
