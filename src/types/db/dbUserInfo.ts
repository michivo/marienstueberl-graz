export interface DbUserInfo {
    uid: string;
    role: 'admin' | 'client' | 'employee' | undefined;
}