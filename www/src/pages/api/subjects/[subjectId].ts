import type { APIRoute } from 'astro';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';
import { subjectEditApiSchema } from '@components/subjects/types';

export const PATCH: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const subject = await Subject.fetch(params.subjectId ?? '');

    if (subject === null) {
        return Response.json(null, { status: 404 });
    }

    const data = subjectEditApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
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

    const otherSubject = semesterSubjects.find(
        s => s.name.toLowerCase() === data.name?.toLowerCase() && s.semesterNumber === data.semesterNumber,
    );

    if (otherSubject && otherSubject.id !== subject.id) {
        return Response.json(false, { status: 200 });
    }

    await subject.edit({
        name: data.name,
        teachers: teachers,
        description: data.description,
        moodleCourseId: data.moodleCourseId,
        durationMinutes: data.durationMinutes,
        classRepeatWeeks: data.classRepeatWeeks,
        studyMode: data.studyMode,
        studyCycle: data.studyCycle,
        semesterNumber: data.semesterNumber,
    });

    return Response.json(true, { status: 200 });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
    const { user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const subject = await Subject.fetch(params.subjectId ?? '');

    if (!subject) {
        return Response.json(null, { status: 404 });
    }

    await subject.delete();

    return Response.json(true, { status: 200 });
};
