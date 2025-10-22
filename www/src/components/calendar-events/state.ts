import type { SemesterData } from '@components/semesters/types';
import { formatDateLocalYyyyMmDd, parseDateLocalYyyyMmDd } from '@components/utils';

const msInDay = 1000 * 60 * 60 * 24;
const daysInWeek = 7;

export class CalendarEventRepeatState {
    repeats: boolean;
    readonly semester: SemesterData;
    readonly startDate: Date;

    private _repeatWeeks: number;
    private _endsBeforeSemester: boolean;
    private _repeatCount: number;
    private _repeatEndDate: string;

    constructor(semester: SemesterData, startDate: string) {
        this.repeats = false;
        this.semester = semester;
        this.startDate = parseDateLocalYyyyMmDd(startDate);
        this._repeatWeeks = 1;
        this._endsBeforeSemester = false;
        this._repeatCount = this.findRepeatCount();
        this._repeatEndDate = this.findEndDate();
    }

    generateDurations(startTime: string, endTime: string): { startDate: string; endDate: string }[] {
        if (!this.repeats) {
            return [
                {
                    startDate: `${formatDateLocalYyyyMmDd(this.startDate)}T${startTime}`,
                    endDate: `${formatDateLocalYyyyMmDd(this.startDate)}T${endTime}`,
                },
            ];
        }

        const durations: { startDate: string; endDate: string }[] = [];
        const day = new Date(this.startDate);
        for (let i = 0; i < this._repeatCount; i++) {
            durations.push({
                startDate: `${formatDateLocalYyyyMmDd(day)}T${startTime}`,
                endDate: `${formatDateLocalYyyyMmDd(day)}T${endTime}`,
            });

            day.setDate(day.getDate() + daysInWeek * this._repeatWeeks);
        }

        return durations;
    }

    get containedInSemester() {
        return (
            parseDateLocalYyyyMmDd(this._repeatEndDate).getTime() <=
            parseDateLocalYyyyMmDd(this.semester.endDate).getTime()
        );
    }

    get repeatWeeks(): number {
        return this._repeatWeeks;
    }

    set repeatWeeks(value: number) {
        if (value < 1) {
            return;
        }

        this._repeatWeeks = value;
        if (!this._endsBeforeSemester) {
            this._repeatCount = this.findRepeatCount();
            this._repeatEndDate = this.findEndDate();
        } else {
            this._repeatEndDate = this.findEndDate();
        }
    }

    get endsBeforeSemester(): boolean {
        return this._endsBeforeSemester;
    }

    set endsBeforeSemester(value: boolean) {
        if (value === this._endsBeforeSemester) {
            return;
        }

        this._endsBeforeSemester = value;
        if (value) {
            this._repeatCount = 1;
            this._repeatEndDate = this.findEndDate();
        } else {
            this._repeatCount = this.findRepeatCount();
            this._repeatEndDate = this.findEndDate();
        }
    }

    get repeatCount(): number {
        return this._repeatCount;
    }

    set repeatCount(value: number) {
        if (value < 1) {
            return;
        }

        this._repeatCount = value;
        this._repeatEndDate = this.findEndDate();
    }

    get repeatEndDate(): string {
        return this._repeatEndDate;
    }

    set repeatEndDate(value: string) {
        const maxDate = parseDateLocalYyyyMmDd(value);
        this._repeatCount = this.findRepeatCount(maxDate);
        this._repeatEndDate = this.findEndDate();
    }

    private findRepeatCount(maxDate: Date = parseDateLocalYyyyMmDd(this.semester.endDate)): number {
        const msDuration = maxDate.getTime() - this.startDate.getTime();
        const weeksDuration = Math.floor(msDuration / msInDay / (daysInWeek * this._repeatWeeks));

        return weeksDuration + 1;
    }

    private findEndDate(): string {
        const endDate = new Date(this.startDate);
        endDate.setDate(endDate.getDate() + daysInWeek * this._repeatWeeks * (this._repeatCount - 1));

        return formatDateLocalYyyyMmDd(endDate);
    }
}
