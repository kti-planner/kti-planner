import type { APIRoute } from 'astro';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';
import { subjectCreateApiSchema, subjectEditApiSchema } from '@components/subjects/types';

export const POST: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = subjectCreateApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const semester = await Semester.fetch(data.semesterId);

    if (semester === null) {
        return Response.json(null, { status: 404 });
    }

    const teachers = await User.fetchBulk(data.teacherIds);

    if (!teachers.every(teacher => teacher !== null)) {
        return Response.json(false, { status: 404 });
    }

    const semesterSubjects = await Subject.fetchAllFromSemester(semester);

    if (semesterSubjects.find(s => s.name.toLowerCase() === data.name.toLowerCase())) {
        return Response.json(false, { status: 200 });
    }

    await Subject.create({
        name: data.name,
        semester: semester,
        teachers: teachers,
        description: data.description,
        moodleCourseId: data.moodleCourseId,
        duration: data.duration,
        classRepeat: data.classRepeat,
    });

    return Response.json(true, { status: 201 });
};

export const PATCH: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = subjectEditApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const subject = await Subject.fetch(data.id);

    if (subject === null) {
        return Response.json(null, { status: 404 });
    }

    const semester = await Semester.fetch(subject.semesterId);

    if (semester === null) {
        return Response.json(null, { status: 404 });
    }

    const teachers = data.teacherIds === undefined ? undefined : await User.fetchBulk(data.teacherIds);

    if (teachers !== undefined && !teachers.every(teacher => teacher !== null)) {
        return Response.json(false, { status: 404 });
    }

    const semesterSubjects = await Subject.fetchAllFromSemester(semester);

    const otherSubject = semesterSubjects.find(s => s.name.toLowerCase() === data.name?.toLowerCase());

    if (otherSubject && otherSubject.id !== subject.id) {
        return Response.json(false, { status: 200 });
    }

    await subject.edit({
        name: data.name,
        teachers: teachers,
        description: data.description,
        moodleCourseId: data.moodleCourseId,
        duration: data.duration,
        classRepeat: data.classRepeat,
    });

    return Response.json(true, { status: 200 });
};

export const DELETE: APIRoute = async ({ locals, url }) => {
    const { user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const id = url.searchParams.get('id');

    if (id === null) {
        return Response.json(null, { status: 400 });
    }

    const subject = await Subject.fetch(id);

    if (!subject) {
        return Response.json(null, { status: 404 });
    }

    await subject.delete();

    return Response.json(true, { status: 200 });
};
