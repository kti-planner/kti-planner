import type { UserDetailsData } from '@components/users/types';

declare const user: UserDetailsData | null;

export const currentUser = user;
