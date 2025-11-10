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
import type { ScheduleChangeData } from '@components/semesters/types';

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

    const subjectLaboratoryClasses = laboratoryClasses.filter(laboratoryClass => {
        const exercise = exercises.find(exercise => exercise.id === laboratoryClass.exerciseId);
        assert(exercise);
        return exercise.subjectId === subject.id;
    });

    const classes = [baseLaboratoryClass];

    const scheduleChangeData = scheduleChanges.map(makeScheduleChangeData);

    const slots = makeSlots(classes, exercises, scheduleChangeData, data.moveByWeeks);

    let iteration = 0;
    while (true) {
        iteration++;

        if (iteration > 1000) {
            throw Error('Moving laboratory classes likely caused infinite loop');
        }

        const conflictingClasses = subjectLaboratoryClasses.filter(
            laboratoryClass =>
                !classes.find(laboratoryClass2 => laboratoryClass2.id === laboratoryClass.id) &&
                slots.some(
                    slot =>
                        laboratoryClass.startDate.getTime() < slot.endDate.getTime() &&
                        laboratoryClass.endDate.getTime() > slot.startDate.getTime(),
                ),
        );

        if (conflictingClasses.length === 0) {
            break;
        }

        const conflictingSlots = makeSlots(conflictingClasses, exercises, scheduleChangeData, data.moveByWeeks);

        classes.push(...conflictingClasses);
        slots.push(...conflictingSlots);
    }

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

    await Promise.all(
        classes.map(laboratoryClass => {
            const slot = slots.find(slot => slot.id === laboratoryClass.id);
            assert(slot);

            return laboratoryClass.edit({
                startDate: slot.startDate,
                endDate: slot.endDate,
            });
        }),
    );

    return Response.json([]);
};

function makeSlots(
    classes: LaboratoryClass[],
    exercises: Exercise[],
    scheduleChangeData: ScheduleChangeData[],
    moveByWeeks: number,
): EventSlot[] {
    return classes.map<EventSlot>(laboratoryClass => {
        const exercise = exercises.find(exercise => exercise.id === laboratoryClass.exerciseId);
        assert(exercise);

        const startDate = getDayOfTheWeekOccurrence(
            laboratoryClass.startDate,
            scheduleChangeData,
            moveByWeeks > 0 ? 1 : -1,
            Math.abs(moveByWeeks) - 1,
        );

        const endDate = getDayOfTheWeekOccurrence(
            laboratoryClass.endDate,
            scheduleChangeData,
            moveByWeeks > 0 ? 1 : -1,
            Math.abs(moveByWeeks) - 1,
        );

        return {
            id: laboratoryClass.id,
            classroomId: exercise.classroomId,
            startDate,
            endDate,
        };
    });
}
