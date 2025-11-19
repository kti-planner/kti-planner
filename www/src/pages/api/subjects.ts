import type { APIRoute } from 'astro';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';
import { subjectCreateApiSchema } from '@components/subjects/types';

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

    if (
        semesterSubjects.find(
            s => s.name.toLowerCase() === data.name.toLowerCase() && s.semesterNumber === data.semesterNumber,
        )
    ) {
        return Response.json(false, { status: 200 });
    }

    await Subject.create({
        name: data.name,
        semester: semester,
        teachers: teachers,
        description: data.description,
        moodleCourseId: data.moodleCourseId,
        durationMinutes: data.durationMinutes,
        classRepeatWeeks: data.classRepeatWeeks,
        studyMode: data.studyMode,
        studyCycle: data.studyCycle,
        semesterNumber: data.semesterNumber,
        color: data.color,
    });

    return Response.json(true, { status: 201 });
};
