import type { ScheduleChangeType } from '@backend/semester';
import type { ScheduleChangeData } from '@components/semesters/types';

export function getNextDayOfTheWeekOccurance(date: Date, changes: ScheduleChangeData[]): Date {
    const changeMap = new Map<Date, ScheduleChangeType>();
    for (const change of changes) {
        changeMap.set(new Date(change.date), change.type);
    }

    function getEffectiveDay(date: Date): ScheduleChangeType {
        const change = changeMap.get(date);
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
