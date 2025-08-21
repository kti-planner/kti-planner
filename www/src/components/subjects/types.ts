import type { UserData } from '@components/users/types';

export interface SubjectData {
    id: string;
    name: string;
    semesterId: string;
    slug: string;
    teachers: UserData[];
}
