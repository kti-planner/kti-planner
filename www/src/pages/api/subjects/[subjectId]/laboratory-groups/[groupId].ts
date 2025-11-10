import type { APIRoute } from 'astro';
import { LaboratoryGroup } from '@backend/laboratory-group';
import { Subject } from '@backend/subject';
import { laboratoryGroupEditApiSchema } from '@components/laboratory-groups/types';

export const PATCH: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const subject = await Subject.fetch(params.subjectId ?? '');

    if (subject === null) {
        return Response.json(null, { status: 404 });
    }

    const group = await LaboratoryGroup.fetch(params.groupId ?? '');

    if (group === null || group.subjectId !== subject.id) {
        return Response.json(null, { status: 404 });
    }

    const data = laboratoryGroupEditApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const groups = await LaboratoryGroup.fetchAllFromSubject(subject);
    const otherGroup = groups.find(group => group.name === data.name);

    if (otherGroup && otherGroup.id !== group.id) {
        return Response.json(false, { status: 200 });
    }

    await group.edit({
        name: data.name,
    });

    return Response.json(true, { status: 200 });
};

export const DELETE: APIRoute = async ({ locals, params }) => {
    const { user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const subject = await Subject.fetch(params.subjectId ?? '');

    if (subject === null) {
        return Response.json(null, { status: 404 });
    }

    const laboratoryGroup = await LaboratoryGroup.fetch(params.groupId ?? '');

    if (!laboratoryGroup || laboratoryGroup.subjectId !== subject.id) {
        return Response.json(null, { status: 404 });
    }

    await laboratoryGroup.delete();

    return Response.json(true, { status: 200 });
};
