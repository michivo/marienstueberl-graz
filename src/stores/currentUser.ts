import { writable } from 'svelte/store';
import type { CurrentUser } from '../types/userInfo';

export const currentUser = writable<CurrentUser>({state: 'pending'});