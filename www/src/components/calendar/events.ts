import type { EventInput } from '@fullcalendar/core';
import type { CalendarEventData } from '@components/calendar-events/types';
import type { LaboratoryClassData } from '@components/laboratory-classes/types';
import type { ScheduleChangeData } from '@components/semesters/types';

export type LaboraoryClassEventInput = EventInput & {
    extendedProps: {
        laboratoryClass: LaboratoryClassData;
    };
};

export type CalendarEventInput = EventInput & {
    extendedProps: {
        calendarEvent: CalendarEventData;
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

export function getCalendarEvents(calendarEvents: CalendarEventData[]): CalendarEventInput[] {
    return calendarEvents.map<CalendarEventInput>(calendarEvent => ({
        title: calendarEvent.name,
        start: calendarEvent.startDate,
        end: calendarEvent.endDate,
        extendedProps: { calendarEvent },
    }));
}

export function getInitialDate(laboratoryClasses: LaboratoryClassData[]): Date | undefined {
    const firstClass = laboratoryClasses[0];
    const lastClass = laboratoryClasses.at(-1);

    if (!firstClass || !lastClass) {
        return undefined;
    }

    const today = new Date();
    const firstEventDate = new Date(firstClass.startDate);
    const lastEventDate = new Date(lastClass.startDate);

    if (today.getTime() < firstEventDate.getTime()) {
        return firstEventDate;
    } else if (today.getTime() > lastEventDate.getTime()) {
        return lastEventDate;
    } else {
        return today;
    }
}
