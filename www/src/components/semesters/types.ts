import type { SemesterType } from '@backend/semester';

export interface SemesterData {
    id: string;
    type: SemesterType;
    year: number;
    startDate: string;
    endDate: string;
}
