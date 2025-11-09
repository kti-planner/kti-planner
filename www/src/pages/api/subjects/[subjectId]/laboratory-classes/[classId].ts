import assert from 'node:assert';
import type { APIRoute } from 'astro';
import { checkForEventConflicts } from '@backend/calendar-checks';
import { CalendarEvent } from '@backend/calendar-events';
import { Exercise } from '@backend/exercise';
import { LaboratoryClass } from '@backend/laboratory-class';
import { Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { User } from '@backend/user';
import { laboratoryClassEditApiSchema } from '@components/laboratory-classes/types';

export const PATCH: APIRoute = async ({ locals, params }) => {
    const { jsonData, user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const subject = await Subject.fetch(params.subjectId ?? '');
    if (!subject) {
        return Response.json(null, { status: 404 });
    }

    const semester = await Semester.fetch(subject.semesterId);
    if (!semester) {
        return new Response(null, { status: 404 });
    }

    const laboratoryClass = await LaboratoryClass.fetch(params.classId ?? '');

    if (!laboratoryClass) {
        return Response.json(null, { status: 404 });
    }

    const data = laboratoryClassEditApiSchema.nullable().catch(null).parse(jsonData);

    if (!data) {
        return Response.json(null, { status: 400 });
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

export const DELETE: APIRoute = async ({ locals, params }) => {
    const { user } = locals;

    if (!user) {
        return Response.json(null, { status: 404 });
    }

    const subject = await Subject.fetch(params.subjectId ?? '');

    if (subject === null) {
        return Response.json(null, { status: 404 });
    }

    const laboratoryClass = await LaboratoryClass.fetch(params.classId ?? '');

    if (!laboratoryClass || (await Exercise.fetch(laboratoryClass.exerciseId))?.subjectId !== subject.id) {
        return Response.json(null, { status: 404 });
    }

    await laboratoryClass.delete();

    return Response.json(true, { status: 200 });
};
