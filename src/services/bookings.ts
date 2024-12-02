import { addDoc, collection } from "firebase/firestore";
import { firebaseDb } from "./firebase";
import { getCurrentMonday } from "../utils/dateUtils";
import type { Booking } from "../types/booking";
import type { Client } from "../types/client";

type BookingDoc = Partial<Booking>;

const collectionName = 'bookings';

export async function makeBooking(client: Client, date: Date, startTime: string, endTime: string) {
    const booking : Booking = { 
        client: client,
        weekOf: getCurrentMonday(),
        startTime: startTime,
        endTime: endTime,
        status: 'confirmed',
        date: date
    };

    const database = firebaseDb;
    const bookingCollection = collection(database, collectionName);
    const bookingDoc = { ...booking as BookingDoc };
    await addDoc(bookingCollection, bookingDoc);
}
