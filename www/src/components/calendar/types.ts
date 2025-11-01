export interface EventConflict {
    type: 'holiday' | 'other-event' | 'outside-of-semester';
    startDate: string;
    endDate: string;
}
