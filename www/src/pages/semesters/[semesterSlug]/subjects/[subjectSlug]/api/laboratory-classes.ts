import assert from 'node:assert';
import type { APIRoute } from 'astro';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { LaboratoryClass, type LaboratoryClassCreateData, makeLaboratoryClassData } from '@backend/laboratory-class';
import { LaboratoryGroup } from '@backend/laboratory-group';
import { User } from '@backend/user';
import { laboratoryClassCreateApiSchema, type LaboratoryClassData } from '@components/laboratory-classes/types';
import { getSubjectFromParams } from '@pages/semesters/[semesterSlug]/[subjectSlug]/api/_subject-utils';

export const GET: APIRoute = async ({ params, url }) => {
    const subject = await getSubjectFromParams(params);
    if (!subject) {
        return Response.json(null, { status: 404 });
    }

    const groupsFilter = url.searchParams.getAll('laboratoryGroup');

    const classes = await LaboratoryClass.fetchAllFromSubject(subject);
    const groups = await LaboratoryGroup.fetchAllFromSubject(subject);
    const filteredGroups = groupsFilter.length > 0 ? groups.filter(g => groupsFilter.includes(g.name)) : groups;
    const users = await User.fetchAll();
    const classrooms = await Classroom.fetchAll();
    const exercises = await Exercise.fetchAllFromSubject(subject);

    return Response.json(
        classes
            .filter(c => filteredGroups.some(g => g.id === c.laboratoryGroupId))
            .map<LaboratoryClassData>(laboratoryClass => {
                const exercise = exercises.find(e => e.id === laboratoryClass.exerciseId);
                const group = groups.find(g => g.id === laboratoryClass.laboratoryGroupId);
                const classTeacher = users.find(u => u.id === laboratoryClass.teacherId);
                assert(exercise && group && classTeacher);

                const exerciseClassroom = classrooms.find(c => c.id === exercise.classroomId);
                const exerciseTeacher = users.find(u => u.id === exercise.teacherId);
                assert(exerciseClassroom && exerciseTeacher);

                return makeLaboratoryClassData(
                    laboratoryClass,
                    exercise,
                    exerciseClassroom,
                    exerciseTeacher,
                    group,
                    classTeacher,
                );
            }) satisfies LaboratoryClassData[],
        { status: 200 },
    );
};

export const POST: APIRoute = async ({ locals }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const data = laboratoryClassCreateApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const createData: LaboratoryClassCreateData[] = [];

    for (const laboratoryClass of data) {
        const exercise = await Exercise.fetch(laboratoryClass.exerciseId);

        if (!exercise) {
            return Response.json(null, { status: 400 });
        }

        const teacher = await exercise.getTeacher();

        const group = await LaboratoryGroup.fetch(laboratoryClass.laboratoryGroupId);

        if (!group) {
            return Response.json(null, { status: 400 });
        }

        createData.push({
            exercise,
            laboratoryGroup: group,
            startDate: laboratoryClass.startDate,
            endDate: laboratoryClass.endDate,
            teacher,
        });
    }

    await Promise.all(createData.map(createDatum => LaboratoryClass.create(createDatum)));

    return Response.json(true, { status: 201 });
};
