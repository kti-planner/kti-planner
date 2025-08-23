import type { UserData } from '@components/users/types';

declare const user: UserData | null;

const localUser = user;

export { localUser as currentUser };
