import * as logger from 'firebase-functions/logger';
import { Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from 'firebase-admin';

export async function updateUserRole(decodedIdToken: DecodedIdToken | undefined, request: Request, response: Response, customClaims: object) {
    try {
        if (decodedIdToken && decodedIdToken.admin) {
            logger.info('Received request to grant rights');
            const requestData = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
            const uid = requestData.uid;
            logger.log('Setting custom claims for user', { uid: uid }, customClaims);
            await auth().setCustomUserClaims(uid, customClaims);
            response.status(200).send('Success');
        }
        else {
            logger.error('User is not an admin', decodedIdToken);
            response.status(403).send('Unauthorized');
        }
    } catch (error) {
        logger.error('Error granting rights', error);
        response.status(500).send('Error granting rights');
    }
}