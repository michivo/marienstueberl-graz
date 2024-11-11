import type { User } from 'firebase/auth';

export type UserState = 'loggedIn' | 'loggedOut' | 'pending';

export interface CurrentUser {
    user?: User,
    state: UserState,
}
