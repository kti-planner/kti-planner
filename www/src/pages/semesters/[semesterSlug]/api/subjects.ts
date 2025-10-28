import type { APIRoute } from 'astro';
import { Semester } from '@backend/semester';
import { makeSubjectData, Subject } from '@backend/subject';
import { User } from '@backend/user';

export const GET: APIRoute = async ({ locals, params }) => {
    const { user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const semester = await Semester.fetchBySlug(params.semesterSlug ?? '');

    if (!semester) {
        return Response.json(null, { status: 404 });
    }

    const subjects = await Subject.fetchAllFromSemester(semester);
    const users = await User.fetchAll();

    return Response.json(
        subjects.map(subject => makeSubjectData(subject, users)),
        { status: 200 },
    );
};
