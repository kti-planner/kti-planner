import type { APIRoute } from 'astro';
import { z } from 'zod';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';

const schema = z.object({
    name: z.string().trim().nonempty(),
    semesterId: z.string().uuid(),
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

    const semester = await Semester.fetch(data.semesterId);

    if (semester === null) {
        return Response.json(null, { status: 404 });
    }

    const semesterSubjects = await Subject.fetchAllFromSemester(semester);

    if (semesterSubjects.find(s => s.name.toLowerCase() === data.name.toLowerCase())) {
        return Response.json(false, { status: 200 });
    }

    await Subject.create({ name: data.name, semester: semester });

    return Response.json(true, { status: 201 });
};

const schemaEdit = z.object({
    id: z.string().uuid(),
    name: z.string().optional(),
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

    const subject = await Subject.fetch(data.id);

    if (subject === null) {
        return Response.json(null, { status: 404 });
    }

    const semester = await Semester.fetch(subject.semesterId);

    if (semester === null) {
        return Response.json(null, { status: 404 });
    }

    const semesterSubjects = await Subject.fetchAllFromSemester(semester);

    const otherSubject = semesterSubjects.find(s => s.name.toLowerCase() === data.name?.toLowerCase());

    if (otherSubject && otherSubject.id !== subject.id) {
        return Response.json(false, { status: 200 });
    }

    await subject.edit(data);

    return Response.json(true, { status: 200 });
};
