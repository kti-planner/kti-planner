import type { RoleType } from '@backend/user';

export interface UserData {
    id: string;
    name: string;
    email: string;
    role: RoleType;
}
