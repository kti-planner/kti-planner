export interface EventConflict {
    type: 'holiday' | 'other-event';
    startDate: string;
    endDate: string;
}
