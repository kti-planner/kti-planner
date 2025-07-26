import type { SemesterType } from '@backend/semester';

export interface SemesterData {
    id: string;
    type: SemesterType;
    year: number;
    slug: string;
    startDate: string;
    endDate: string;
}
