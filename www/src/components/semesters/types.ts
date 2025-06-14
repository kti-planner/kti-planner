export type SemesterType = 'summer' | 'winter';

export interface SemesterData {
    id: string;
    type: SemesterType;
    year: number;
    startDate: string;
    endDate: string;
}
