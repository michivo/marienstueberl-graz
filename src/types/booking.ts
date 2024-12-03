import type { Client } from "./client";

export type BookingStatus = 'confirmed' | 'pickedUp' | 'cancelled';

export interface Booking {
    client: Client,
    weekOf: Date,
    date: Date,
    startTime: string,
    endTime: string,
    status: BookingStatus,
    pickupTime?: string,
}