import assert from 'node:assert';
import type { CalendarEvent } from '@backend/calendar-events';
import type { Exercise } from '@backend/exercise';
import type { LaboratoryClass } from '@backend/laboratory-class';
import type { ScheduleChange, Semester } from '@backend/semester';
import type { EventConflict } from '@components/calendar/types';
import { isSameDay, truncateDate } from '@components/laboratory-classes/dates';
import { formatDateLocalYyyyMmDdHhMm } from '@components/utils';

export interface EventSlot {
    id: string | null;
    classroomId: string | null;
    startDate: Date;
    endDate: Date;
}

export function checkForEventConflicts(
    slots: EventSlot[],
    semester: Semester,
    scheduleChanges: ScheduleChange[],
    laboratoryClasses: LaboratoryClass[],
    exercises: Exercise[],
    calendarEvents: CalendarEvent[],
    ignoreIds: string[] = [],
): EventConflict[] {
    const outsideOfSemesterConflicts = slots
        .filter(
            slot =>
                truncateDate(slot.startDate).getTime() < semester.startDate.getTime() ||
                truncateDate(slot.endDate).getTime() > semester.endDate.getTime(),
        )
        .map<EventConflict>(slot => ({
            type: 'outside-of-semester',
            startDate: formatDateLocalYyyyMmDdHhMm(slot.startDate),
            endDate: formatDateLocalYyyyMmDdHhMm(slot.endDate),
        }));

    const holidayConflicts = slots
        .filter(slot =>
            scheduleChanges.some(change => change.type === 'holiday' && isSameDay(slot.startDate, change.date)),
        )
        .map<EventConflict>(slot => ({
            type: 'holiday',
            startDate: formatDateLocalYyyyMmDdHhMm(slot.startDate),
            endDate: formatDateLocalYyyyMmDdHhMm(slot.endDate),
        }));

    const laboratoryClassConflicts = slots
        .filter(slot =>
            laboratoryClasses.some(laboratoryClass => {
                const exercise = exercises.find(exercise => exercise.id === laboratoryClass.exerciseId);
                assert(exercise);

                return (
                    slot.id !== laboratoryClass.id &&
                    !ignoreIds.includes(laboratoryClass.id) &&
                    slot.classroomId !== null &&
                    slot.classroomId === exercise.classroomId &&
                    slot.startDate.getTime() < laboratoryClass.endDate.getTime() &&
                    slot.endDate.getTime() > laboratoryClass.startDate.getTime()
                );
            }),
        )
        .map<EventConflict>(slot => ({
            type: 'other-event',
            startDate: formatDateLocalYyyyMmDdHhMm(slot.startDate),
            endDate: formatDateLocalYyyyMmDdHhMm(slot.endDate),
        }));

    const calendarEventConflicts = slots
        .filter(slot =>
            calendarEvents.some(
                calendarEvent =>
                    slot.id !== calendarEvent.id &&
                    !ignoreIds.includes(calendarEvent.id) &&
                    slot.classroomId !== null &&
                    slot.classroomId === calendarEvent.classroomId &&
                    slot.startDate.getTime() < calendarEvent.endDate.getTime() &&
                    slot.endDate.getTime() > calendarEvent.startDate.getTime(),
            ),
        )
        .map<EventConflict>(slot => ({
            type: 'other-event',
            startDate: formatDateLocalYyyyMmDdHhMm(slot.startDate),
            endDate: formatDateLocalYyyyMmDdHhMm(slot.endDate),
        }));

    return [...outsideOfSemesterConflicts, ...holidayConflicts, ...laboratoryClassConflicts, ...calendarEventConflicts];
}
