import { writable } from "svelte/store";
import type { UserInfo } from "../types/userInfo";

export const currentUser = writable<UserInfo | null | undefined>(undefined);