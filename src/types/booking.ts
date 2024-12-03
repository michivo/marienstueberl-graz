import type { Client } from "./client";

export type BookingStatus = 'confirmed' | 'pickedUp' | 'cancelled';

export interface Booking {
    client: Client,
    weekOf: string,
    date: string,
    startTime: string,
    endTime: string,
    status: BookingStatus,
    pickUpDateTimeLocal?: string,
}