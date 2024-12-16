import * as logger from 'firebase-functions/logger';
import { Request, Response } from 'express';
import { DecodedIdToken, UpdateRequest } from 'firebase-admin/auth';
import { auth } from 'firebase-admin';
import { UserAccount } from '../types/userAccount';

export async function updateUserProfile(decodedIdToken: DecodedIdToken | undefined, request: Request, response: Response) {
    try {
        if (decodedIdToken && decodedIdToken.admin) {
            const requestData: UserAccount = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
            const uid = requestData.uid;
            logger.log('Setting custom claims for user', { uid: uid }, );
            const updateRequest: UpdateRequest = {};
            if(requestData.displayName) {
                updateRequest.displayName = requestData.displayName;
            }
            if(requestData.email) {
                updateRequest.email = requestData.email;
            }
            auth().updateUser(uid, updateRequest);
            if(requestData.customClaims?.admin) {
                await auth().setCustomUserClaims(uid, { admin: true });
            }
            else if(requestData.customClaims?.privilegedUser) {
                await auth().setCustomUserClaims(uid, { privilegedUser: true });
            }
            logger.log('Granted rights successfully', decodedIdToken);
            response.status(200).send('Success');
        }
        else {
            logger.error('User is not an admin', decodedIdToken);
            response.status(403).send('Unauthorized');
        }
    } catch (error) {
        logger.error('Error updating user', error);
        response.status(500).send('Error updating user');
    }
}