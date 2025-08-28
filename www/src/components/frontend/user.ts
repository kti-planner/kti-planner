import type { UserData } from '@components/users/types';

declare const user: UserData | null;

export const currentUser = user;
