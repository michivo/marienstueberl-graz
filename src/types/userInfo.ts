import type { User } from 'firebase/auth';

export type UserRole = 'admin' | 'client' | 'employee' | undefined;

export interface UserInfo extends User {
    role: UserRole;
}