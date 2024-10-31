export interface Client {
    id: string;
    userUid: string;
    name: string;
    email: string;
    peopleCount: number;
    childrenCount: number;
    validThrough: Date;
}