/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from 'firebase-functions/v2/https';
 * import {onDocumentWritten} from 'firebase-functions/v2/firestore';
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import { initializeApp } from 'firebase-admin/app';
import { auth } from 'firebase-admin';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest({ region: 'europe-west1', cors: ['*'] }, (_, response) => {
  logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

export const setIsAdmin = onRequest({ region: 'europe-west1', cors: ['*'] }, async (request, response) => {
  if ((!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) &&
    !(request.cookies && request.cookies.__session)) {
    logger.error('No Firebase ID token was passed as a Bearer token in the Authorization header.');
    response.status(403).send('Unauthorized');
    return;
  }
  let idToken;
  if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
    logger.log("Found 'Authorization' header");
    // Read the ID Token from the Authorization header.
    idToken = request.headers.authorization.split('Bearer ')[1];
  } else if (request.cookies) {
    logger.log("Found '__session' cookie");
    // Read the ID Token from cookie.
    idToken = request.cookies.__session;
  } else {
    // No cookie
    response.status(403).send('Unauthorized');
    return;
  }

  try {
    initializeApp();
    const decodedIdToken = await auth().verifyIdToken(idToken);
    logger.log('ID Token correctly decoded', decodedIdToken);
    if (decodedIdToken.admin === true) {
      await auth().setCustomUserClaims(decodedIdToken.uid, { admin: true });
      logger.log('Granted admin rights successfully', decodedIdToken);
      response.status(200).send('Success');
    }
    else {
      logger.error('User is not an admin', decodedIdToken);
      response.status(403).send('Unauthorized');  
    }
    return;
  } catch (error) {
    logger.error('Error while verifying Firebase ID token:', error);
    response.status(403).send('Unauthorized');
    return;
  }
});