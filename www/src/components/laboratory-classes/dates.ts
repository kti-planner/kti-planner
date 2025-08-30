import type { ScheduleChangeType } from '@backend/semester';
import type { ScheduleChangeData } from '@components/semesters/types';
import { formatDateLocalYyyyMmDd } from '@components/utils';

export function isSameDay(date1: Date, date2: Date) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

export function getNextDayOfTheWeekOccurance(date: Date, changes: ScheduleChangeData[]): Date {
    const changeMap = new Map<string, ScheduleChangeType>();
    for (const change of changes) {
        const date = new Date(change.date);
        changeMap.set(formatDateLocalYyyyMmDd(date), change.type);
    }

    function getEffectiveDay(date: Date): ScheduleChangeType {
        const change = changeMap.get(formatDateLocalYyyyMmDd(date));
        if (change) {
            return change;
        }

        return weekdayName(date);
    }

    const targetScheduleDay = getEffectiveDay(date);

    const next = new Date(date);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
        next.setDate(next.getDate() + 1);

        const effectiveDay = getEffectiveDay(next);

        if (effectiveDay === 'holiday') {
            continue;
        }

        if (effectiveDay === targetScheduleDay) {
            return next;
        }
    }
}

function weekdayName(date: Date): ScheduleChangeType {
    return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
        date.getDay()
    ] as ScheduleChangeType;
}
