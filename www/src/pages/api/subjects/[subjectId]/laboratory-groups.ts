import type { APIRoute } from 'astro';
import { LaboratoryGroup, makeLaboratoryGroupData } from '@backend/laboratory-group';
import { Subject } from '@backend/subject';
import { laboratoryGroupCreateApiSchema } from '@components/laboratory-groups/types';

export const GET: APIRoute = async ({ url, params }) => {
    const subject = await Subject.fetch(params.subjectId ?? '');

    if (subject === null) {
        return Response.json(null, { status: 404 });
    }

    const laboratoryGroups = await LaboratoryGroup.fetchAllFromSubject(subject);

    return Response.json(laboratoryGroups.map(makeLaboratoryGroupData), { status: 200 });
};

export const POST: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const subject = await Subject.fetch(params.subjectId ?? '');

    if (subject === null) {
        return Response.json(null, { status: 404 });
    }

    const data = laboratoryGroupCreateApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const groups = await LaboratoryGroup.fetchAllFromSubject(subject);
    if (groups.some(group => group.name === data.name)) {
        return Response.json(false, { status: 200 });
    }

    await LaboratoryGroup.create({
        name: data.name,
        subject,
    });

    return Response.json(true, { status: 201 });
};
