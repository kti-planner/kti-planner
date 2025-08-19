import type { UserData } from '@components/users/types';

export interface ExerciseData {
    id: string;
    name: string;
    subjectId: string;
    exerciseNumber: number;
    classroomId: string;
    teacher: UserData;
}
