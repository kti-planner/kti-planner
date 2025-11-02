import assert from 'node:assert';
import type { APIRoute } from 'astro';
import { checkForEventConflicts, type EventSlot } from '@backend/calendar-checks';
import { CalendarEvent } from '@backend/calendar-events';
import { Exercise } from '@backend/exercise';
import { LaboratoryClass } from '@backend/laboratory-class';
import { makeScheduleChangeData, Semester } from '@backend/semester';
import { Subject } from '@backend/subject';
import { getDayOfTheWeekOccurrence } from '@components/laboratory-classes/dates';
import { laboratoryClassMoveApiSchema } from '@components/laboratory-classes/types';
import { getSubjectFromParams } from '@pages/semesters/[semesterSlug]/subjects/[subjectSlug]/api/_subject-utils';

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

    const data = laboratoryClassMoveApiSchema.nullable().catch(null).parse(jsonData);
    if (!data) {
        return Response.json(null, { status: 400 });
    }

    const subjects = await Subject.fetchAllFromSemester(semester);
    const scheduleChanges = await semester.getScheduleChanges();
    const laboratoryClasses = await LaboratoryClass.fetchAllFromSubjects(subjects);
    const calendarEvents = await CalendarEvent.fetchAllFromSemester(semester);

    const baseLaboratoryClass = laboratoryClasses.find(laboratoryClass => laboratoryClass.id === data.id);
    if (!baseLaboratoryClass) {
        return Response.json(null, { status: 400 });
    }

    const exercises = await Exercise.fetchAllFromSubjects(subjects);
    const baseExercise = exercises.find(exercise => exercise.id === baseLaboratoryClass.exerciseId);
    assert(baseExercise);

    const classes = (await LaboratoryClass.fetchAllFromSubject(subject)).filter(laboratoryClass => {
        const exercise = exercises.find(exercise => exercise.id === laboratoryClass.exerciseId);
        assert(exercise);

        return (
            laboratoryClass.laboratoryGroupId === baseLaboratoryClass.laboratoryGroupId &&
            ((exercise.exerciseNumber >= baseExercise.exerciseNumber && data.moveByWeeks > 0) ||
                (exercise.exerciseNumber <= baseExercise.exerciseNumber && data.moveByWeeks < 0))
        );
    });

    const scheduleChangeData = scheduleChanges.map(makeScheduleChangeData);

    const slots = classes.map<EventSlot>(laboratoryClass => {
        const exercise = exercises.find(exercise => exercise.id === laboratoryClass.exerciseId);
        assert(exercise);

        const startDate = getDayOfTheWeekOccurrence(
            laboratoryClass.startDate,
            scheduleChangeData,
            Math.sign(data.moveByWeeks),
            Math.abs(data.moveByWeeks) - 1,
        );

        const endDate = getDayOfTheWeekOccurrence(
            laboratoryClass.endDate,
            scheduleChangeData,
            Math.sign(data.moveByWeeks),
            Math.abs(data.moveByWeeks) - 1,
        );

        return {
            id: laboratoryClass.id,
            classroomId: exercise.classroomId,
            startDate,
            endDate,
        };
    });

    const ignoreIds = classes.map(laboratoryClass => laboratoryClass.id);

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

    const editOperations: Promise<void>[] = [];
    for (const laboratoryClass of classes) {
        const slot = slots.find(slot => slot.id === laboratoryClass.id);
        assert(slot);

        editOperations.push(
            laboratoryClass.edit({
                startDate: slot.startDate,
                endDate: slot.endDate,
            }),
        );
    }

    await Promise.all(editOperations);

    return Response.json([]);
};
