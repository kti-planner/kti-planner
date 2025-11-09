import assert from 'node:assert';
import type { APIRoute } from 'astro';
import { checkForEventConflicts, type EventSlot } from '@backend/calendar-checks';
import { CalendarEvent } from '@backend/calendar-events';
import { Classroom } from '@backend/classroom';
import { Exercise } from '@backend/exercise';
import { LaboratoryClass, type LaboratoryClassCreateData, makeLaboratoryClassData } from '@backend/laboratory-class';
import { LaboratoryGroup } from '@backend/laboratory-group';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';
import {
    laboratoryClassCreateApiSchema,
    type LaboratoryClassData,
    laboratoryClassEditApiSchema,
} from '@components/laboratory-classes/types';
import { getSubjectFromParams } from '@pages/semesters/[semesterSlug]/subjects/[subjectSlug]/api/_subject-utils';

export const GET: APIRoute = async ({ params, url }) => {
    const subject = await getSubjectFromParams(params);
    if (!subject) {
        return Response.json(null, { status: 404 });
    }

    const groupsFilter = url.searchParams.getAll('laboratoryGroup');
    const exerciseFilter = url.searchParams.getAll('exercise');

    const classes = await LaboratoryClass.fetchAllFromSubject(subject);
    const groups = await LaboratoryGroup.fetchAllFromSubject(subject);
    const filteredGroups = groupsFilter.length > 0 ? groups.filter(g => groupsFilter.includes(g.name)) : groups;
    const users = await User.fetchAll();
    const classrooms = await Classroom.fetchAll();
    const exercises = await Exercise.fetchAllFromSubject(subject);

    return Response.json(
        classes
            .filter(c => filteredGroups.some(g => g.id === c.laboratoryGroupId))
            .filter(c => exerciseFilter.length === 0 || exerciseFilter.includes(c.exerciseId))
            .map<LaboratoryClassData>(laboratoryClass => {
                const exercise = exercises.find(e => e.id === laboratoryClass.exerciseId);
                assert(exercise);

                const group = groups.find(g => g.id === laboratoryClass.laboratoryGroupId);
                assert(group);

                const classTeacher = users.find(u => u.id === laboratoryClass.teacherId) ?? null;
                const exerciseClassroom = classrooms.find(c => c.id === exercise.classroomId) ?? null;
                const exerciseTeacher = users.find(u => u.id === exercise.teacherId) ?? null;

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

export const POST: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;
    const { semesterSlug } = params;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    if (semesterSlug === undefined) {
        return new Response(null, { status: 404 });
    }

    const semester = await Semester.fetchBySlug(semesterSlug);
    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const subject = await getSubjectFromParams(params);
    if (!subject) {
        return Response.json(null, { status: 404 });
    }

    const data = laboratoryClassCreateApiSchema.nullable().catch(null).parse(jsonData);
    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const group = await LaboratoryGroup.fetch(data.laboratoryGroupId);

    if (!group) {
        return Response.json(null, { status: 400 });
    }

    const subjects = await Subject.fetchAllFromSemester(semester);
    const exercises = await Exercise.fetchAllFromSubjects(subjects);
    const teachers = await subject.getTeachers();
    const scheduleChanges = await semester.getScheduleChanges();
    const laboratoryClasses = await LaboratoryClass.fetchAllFromSubjects(subjects);
    const calendarEvents = await CalendarEvent.fetchAllFromSemester(semester);

    const slots = data.classes.map<EventSlot>(laboratoryClass => {
        const exercise = exercises.find(exercise => exercise.id === laboratoryClass.exerciseId);
        assert(exercise);

        return {
            id: null,
            classroomId: exercise.classroomId,
            startDate: laboratoryClass.startDate,
            endDate: laboratoryClass.endDate,
        };
    });

    const ignoreIds = laboratoryClasses
        .filter(laboratoryClass => laboratoryClass.laboratoryGroupId === group.id)
        .map(laboratoryClass => laboratoryClass.id);

    const conflicts = checkForEventConflicts(
        slots,
        semester,
        scheduleChanges,
        laboratoryClasses,
        exercises,
        calendarEvents,
        ignoreIds,
    );

    if (conflicts.length > 0) {
        return Response.json(conflicts);
    }

    const createData: LaboratoryClassCreateData[] = [];

    for (const laboratoryClass of data.classes) {
        const exercise = exercises.find(exercise => exercise.id === laboratoryClass.exerciseId);
        if (!exercise) {
            return Response.json(null, { status: 400 });
        }

        const teacher = teachers.find(teacher => teacher.id === exercise.teacherId);
        if (!teacher) {
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

    if (createData.length === 1) {
        const classToDelete = laboratoryClasses.find(
            laboratoryClass =>
                laboratoryClass.laboratoryGroupId === group.id &&
                laboratoryClass.exerciseId === createData[0]!.exercise.id,
        );

        await classToDelete?.delete();
    } else {
        await group.deleteAllClasses();
    }

    await Promise.all(createData.map(createDatum => LaboratoryClass.create(createDatum)));

    return Response.json([]);
};

export const PATCH: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;
    const { semesterSlug } = params;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    if (semesterSlug === undefined) {
        return new Response(null, { status: 404 });
    }

    const semester = await Semester.fetchBySlug(semesterSlug);
    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const subject = await getSubjectFromParams(params);
    if (!subject) {
        return Response.json(null, { status: 404 });
    }

    const data = laboratoryClassEditApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const laboratoryClass = await LaboratoryClass.fetch(data.id);

    if (!laboratoryClass) {
        return Response.json(null, { status: 404 });
    }

    const teacher = data.teacherId === undefined ? undefined : await User.fetch(data.teacherId);

    if (teacher === null) {
        return Response.json(null, { status: 400 });
    }

    const subjects = await Subject.fetchAllFromSemester(semester);
    const scheduleChanges = await semester.getScheduleChanges();
    const laboratoryClasses = await LaboratoryClass.fetchAllFromSubjects(subjects);
    const exercises = await Exercise.fetchAllFromSubjects(subjects);
    const calendarEvents = await CalendarEvent.fetchAllFromSemester(semester);
    const exercise = exercises.find(exercise => laboratoryClass.exerciseId === exercise.id);
    assert(exercise);

    const conflicts = checkForEventConflicts(
        [
            {
                id: laboratoryClass.id,
                classroomId: exercise.classroomId,
                startDate: data.startDate ?? laboratoryClass.startDate,
                endDate: data.endDate ?? laboratoryClass.endDate,
            },
        ],
        semester,
        scheduleChanges,
        laboratoryClasses,
        exercises,
        calendarEvents,
    );

    if (conflicts.length > 0) {
        return Response.json(conflicts);
    }

    await laboratoryClass.edit({
        startDate: data.startDate,
        endDate: data.endDate,
        teacher,
    });

    return Response.json([]);
};

export const DELETE: APIRoute = async ({ locals, url, params }) => {
    const { user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const subject = await getSubjectFromParams(params);

    if (subject === null) {
        return Response.json(null, { status: 400 });
    }

    const id = url.searchParams.get('id');

    if (id === null) {
        return Response.json(null, { status: 400 });
    }

    const laboratoryClass = await LaboratoryClass.fetch(id);

    if (!laboratoryClass || (await Exercise.fetch(laboratoryClass.exerciseId))?.subjectId !== subject.id) {
        return Response.json(null, { status: 404 });
    }

    await laboratoryClass.delete();

    return Response.json(true, { status: 200 });
};
