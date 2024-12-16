import { addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, query, updateDoc, where, type Unsubscribe } from "firebase/firestore";
import { firebaseDb } from "./firebase";
import { getCurrentMonday, toISODateString } from "../utils/dateUtils";
import type { Booking, BookingWithId } from "../types/booking";
import type { Client } from "../types/client";
import type { User } from "firebase/auth";

type BookingDoc = Partial<Booking>;

const collectionName = 'bookings';

export async function makeBooking(client: Client, date: Date, startTime: string, endTime: string) {
    const booking : Booking = { 
        client: client,
        weekOf: toISODateString(getCurrentMonday()),
        startTime: startTime,
        endTime: endTime,
        status: 'confirmed',
        date: toISODateString(date),
    };

    const database = firebaseDb;
    const bookingCollection = collection(database, collectionName);
    const bookingDoc = { ...booking as BookingDoc };
    await addDoc(bookingCollection, bookingDoc);
}

export async function getCurrentBooking(user: User) : Promise<undefined | BookingWithId> {
    const database = firebaseDb;
    const bookingCollection = collection(database, collectionName);
    const weekOf = toISODateString(getCurrentMonday());
    const bookingQuery = query(bookingCollection, where('weekOf', '==', weekOf), where('client.email', '==', user.email), limit(1));
    const snapshot = await getDocs(bookingQuery);
    if(snapshot.empty) {
        return undefined;
    }

    const doc = snapshot.docs[0].data() as BookingWithId;
    doc.id = snapshot.docs[0].id;
    return doc;
}

export function subscribeToBookings(callback: (bookings: Booking[]) => void): Unsubscribe {
    const database = firebaseDb;
    const bookingCollection = collection(database, collectionName);
    const weekOf = toISODateString(getCurrentMonday());
    console.log('Subscribing to bookings for week', weekOf);
    const bookingQuery = query(bookingCollection, where('weekOf', '==', weekOf));
    const unsubscribe = onSnapshot(bookingQuery, (snapshot) => {
        const bookings : Booking[] = [];
        snapshot.forEach((doc) => {
            const booking = doc.data() as Booking;
            bookings.push(booking);
        });
        callback(bookings);
    });
    return unsubscribe;
}

export async function markBookingAsPickedUp(bookingId: string) {
    const database = firebaseDb;
    const bookingCollection = collection(database, collectionName);
    const reference = doc(bookingCollection, bookingId);
    await updateDoc(reference, { status: 'pickedUp', pickUpDateTimeLocal: new Date().toISOString() });
}

export async function getBookingById(bookingId: string) {
    const database = firebaseDb;
    const bookingCollection = collection(database, collectionName);
    const reference = doc(bookingCollection, bookingId);
    const snapshot = await getDoc(reference);
    if(snapshot.exists()) {
        const booking = snapshot.data() as BookingWithId;
        booking.id = bookingId;
        return booking;
    }
    return undefined;
}