import type { APIRoute } from 'astro';
import { LaboratoryGroup, makeLaboratoryGroupData } from '@backend/laboratory-group';
import { laboratoryGroupCreateApiSchema, laboratoryGroupEditApiSchema } from '@components/laboratory-groups/types';
import { getSubjectFromParams } from '@pages/semesters/[semesterSlug]/[subjectSlug]/api/_subject-utils';

export const GET: APIRoute = async ({ url, params }) => {
    const subject = await getSubjectFromParams(params);

    if (subject === null) {
        return Response.json(null, { status: 400 });
    }

    const laboratoryGroups = await LaboratoryGroup.fetchAllFromSubject(subject);

    return Response.json(laboratoryGroups.map(makeLaboratoryGroupData), { status: 200 });
};

export const POST: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const subject = await getSubjectFromParams(params);

    if (subject === null) {
        return Response.json(null, { status: 400 });
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

export const PATCH: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const subject = await getSubjectFromParams(params);

    if (subject === null) {
        return Response.json(null, { status: 400 });
    }

    const data = laboratoryGroupEditApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const group = await LaboratoryGroup.fetch(data.id);

    if (group === null) {
        return Response.json(null, { status: 404 });
    }

    const groups = await LaboratoryGroup.fetchAllFromSubject(subject);
    const otherGroup = groups.find(group => group.name === data.name);

    if (otherGroup && otherGroup.id !== data.id) {
        return Response.json(false, { status: 200 });
    }

    await group.edit({
        name: data.name,
    });

    return Response.json(true, { status: 200 });
};
