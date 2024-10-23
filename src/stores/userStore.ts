import { writable } from "svelte/store";
import type { User } from "../types/user";

export const UserStore = writable<User | undefined>(undefined);