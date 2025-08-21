import type { UserRole } from '@backend/user';

export interface UserData {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}
