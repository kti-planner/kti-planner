import type { EventInput } from '@fullcalendar/core';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { ScheduleChangeData } from '@components/semesters/types';

export type LaboraoryClassEventInput = EventInput & {
    extendedProps: {
        laboratoryClass: LaboratoryClassData;
    };
};

export function getLaboratoryClassEvents(laboratoryClasses: LaboratoryClassData[]): LaboraoryClassEventInput[] {
    return laboratoryClasses.map<LaboraoryClassEventInput>(laboratoryClass => ({
        title: `${laboratoryClass.laboratoryGroup.name} - ${laboratoryClass.exercise.name}`,
        start: laboratoryClass.startDate,
        end: laboratoryClass.endDate,
        extendedProps: { laboratoryClass },
    }));
}

export function getScheduleChangeEvents(scheduleChanges: ScheduleChangeData[]): EventInput[] {
    return scheduleChanges.map<EventInput>(scheduleChange => ({
        display: 'background',
        allDay: true,
        start: scheduleChange.date,
        backgroundColor: scheduleChange.type === 'holiday' ? 'var(--bs-danger)' : 'var(--bs-warning)',
    }));
}

export function getInitialDate(laboratoryClasses: LaboratoryClassData[]): Date | undefined {
    const lastClass = laboratoryClasses.at(-1);

    if (!lastClass) {
        return undefined;
    }

    const today = new Date();
    const lastEventDate = new Date(lastClass.startDate);

    if (today.getTime() < lastEventDate.getTime()) {
        return today;
    } else {
        return lastEventDate;
    }
}
