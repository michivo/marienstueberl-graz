import * as logger from 'firebase-functions/logger';
import { Request, Response } from 'express';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { DecodedIdToken } from 'firebase-admin/auth';
import { Client } from '../types/client';

export async function doCancelReservation(decodedIdToken: DecodedIdToken, request: Request, response: Response) {
    const firebaseDb = getFirestore();
    const client = await getClient(firebaseDb, decodedIdToken);
    if (!client) {
        response.status(404).send('Client not found');
        return;
    }

    logger.info('Making reservation for client', client);
    logger.info('Request body', request.body);
    const requestData = JSON.parse(request.body);

    try {
        const currentBookingQuery = firebaseDb.collection('bookings')
            .where('weekOf', '==', requestData.weekOf)
            .where('client.email', '==', client.email).limit(1);
        const currentBooking = await currentBookingQuery.get();
        if(currentBooking.empty) {
            response.status(404).send('Keine Buchung gefunden.');
            return;
        }

        firebaseDb.collection('bookings').doc(currentBooking.docs[0].id).delete();
        response.status(200).send('Success');
    } catch (error) {
        logger.error('Deleting booking failed', error);
        response.status(500).send('Fehler beim Löschen der Buchung.');
        return;
    }
}

async function getClient(firebaseDb: Firestore, decodedIdToken: DecodedIdToken): Promise<Client | undefined> {
    const userEmail = decodedIdToken.email;
    const clientsQuery = firebaseDb.collection('clients').where('email', '==', userEmail).limit(1);
    const result = await clientsQuery.get();
    if (result.empty) {
        logger.error('Client not found', userEmail);
        return undefined;
    }
    const client = result.docs[0].data() as Client;
    const clientDoc: Client = {
        childrenCount: client.childrenCount,
        email: client.email,
        id: result.docs[0].id,
        name: client.name,
        peopleCount: client.peopleCount,
        userUid: client.userUid,
        validThrough: client.validThrough
    };
    return clientDoc;
}