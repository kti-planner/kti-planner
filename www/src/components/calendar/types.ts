export interface EventConflict {
    type: 'holiday' | 'other-event' | 'outside-of-semester' | 'classes-canceled';
    startDate: string;
    endDate: string;
}
