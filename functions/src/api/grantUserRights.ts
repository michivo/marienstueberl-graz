import * as logger from 'firebase-functions/logger';
import { Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from 'firebase-admin';

export async function grantAdminRights(decodedIdToken: DecodedIdToken | undefined, request: Request, response: Response, customClaims: object) {
    if (decodedIdToken && decodedIdToken.admin) {
        const requestData = JSON.parse(request.body);
        const uid = requestData.uid;
        logger.log('Setting custom claims for user', { uid: uid }, customClaims);
        await auth().setCustomUserClaims(uid, customClaims);
        logger.log('Granted rights successfully', decodedIdToken);
        response.status(200).send('Success');
    }
    else {
        logger.error('User is not an admin', decodedIdToken);
        response.status(403).send('Unauthorized');
    }
}