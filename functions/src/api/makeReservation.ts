import * as logger from 'firebase-functions/logger';
import { Request, Response } from 'express';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { DecodedIdToken } from 'firebase-admin/auth';
import { Client } from '../types/client';
import { Booking } from '../types/booking';
import { DistributionConfig } from '../types/distributionConfig';
import { getCurrentMonday } from '../utils/dateUtils';

const collectionName = 'distributionConfig';
const configKeyPrefix = 'graz';

export async function doMakeReservation(decodedIdToken: DecodedIdToken, request: Request, response: Response) {
    const firebaseDb = getFirestore();
    const client = await getClient(firebaseDb, decodedIdToken);
    if (!client) {
        response.status(404).send('Client not found');
        return;
    }

    const config = await getConfig(firebaseDb);
    if (!config) {
        response.status(500).send('Config not found');
        return;
    }

    logger.info('Making reservation for client', client);
    logger.info('Request body', request.body);
    const requestData = JSON.parse(request.body);

    try {
        await firebaseDb.runTransaction(async (transaction) => {
            const maxBookings = config.peoplePerSlot;
            const existingBookingsQuery = firebaseDb.collection('bookings')
                .where('weekOf', '==', requestData.weekOf).where('date', '==', requestData.date)
                .where('startTime', '==', requestData.startTime).where('endTime', '==', requestData.endTime);
            const existingBookingsCount = await transaction.get(existingBookingsQuery.count());
            if (existingBookingsCount.data().count >= maxBookings) {
                response.status(400).send('Keine Reservierungen mehr möglich. Bitte wählen Sie eine andere Zeit.');
                return;
            }

            const doubleBookingQuery = 
                firebaseDb.collection('bookings').where('weekOf', '==', requestData.weekOf)
                .where('client.email', '==', client.email);
            const doubleBookingCount = await transaction.get(doubleBookingQuery.count());
            if(doubleBookingCount.data().count > 0) {
                response.status(400).send('Sie haben bereits eine Reservierung für diese Woche.');
                return;
            }

            const booking: Booking = {
                client: client,
                weekOf: requestData.weekOf,
                startTime: requestData.startTime,
                endTime: requestData.endTime,
                status: 'confirmed',
                date: requestData.date,
            };

            logger.info('Booking: ');
            logger.info(booking);
            const bookingRef = firebaseDb.collection('bookings').doc();
            await transaction.set(bookingRef, booking);
            response.status(200).send('Success');
        });
    } catch (error) {
        logger.error('Transaction failed', error);
        response.status(500).send('Transaction failed');
        return;
    }
}

async function getConfig(firebaseDb: Firestore): Promise<DistributionConfig | undefined> {
    const currentMonday = getCurrentMonday();
    const configKey = `${configKeyPrefix}-${currentMonday.toISOString().slice(0, 10)}`;
    const configRef = firebaseDb.collection(collectionName).doc(configKey);
    const configDoc = await configRef.get();
    if (!configDoc.exists) {
        console.error('Config not found');
        return undefined;
    }
    return configDoc.data() as DistributionConfig;
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
        validThrough: client.validThrough,
        issuer: client.issuer,
    };
    return clientDoc;
}