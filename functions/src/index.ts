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
import { App, initializeApp } from 'firebase-admin/app';
import { auth } from 'firebase-admin';
import { Request, Response } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';

let app = undefined as App | undefined;

export const helloWorld = onRequest({ region: 'europe-west1', cors: ['*'] }, (_, response) => {
  logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

async function getToken(request: Request, response: Response): Promise<DecodedIdToken | undefined> {
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
  if(!app) {
    app = initializeApp();
  }
  const decodedIdToken = await auth().verifyIdToken(idToken);
  logger.log('ID Token correctly decoded', decodedIdToken);
  return decodedIdToken;
}

export const setIsAdmin = onRequest({ region: 'europe-west1', cors: ['*'] }, async (request, response) => {
  if(request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
  }
  const decodedIdToken = await getToken(request, response);
  if(decodedIdToken && decodedIdToken.admin) {
      const uid = request.body['uid'];
      await auth().setCustomUserClaims(uid, { admin: true });
      logger.log('Granted admin rights successfully', decodedIdToken);
      response.status(200).send('Success');
    }
    else {
      logger.error('User is not an admin', decodedIdToken);
      response.status(403).send('Unauthorized');
    }
});

export const setIsPrivilegedUser = onRequest({ region: 'europe-west1', cors: ['*'] }, async (request, response) => {
  if(request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
  }
  const decodedIdToken = await getToken(request, response);
  if(decodedIdToken && decodedIdToken.admin) {
      const uid = request.body['uid'];
      await auth().setCustomUserClaims(uid, { privilegedUser: true });
      logger.log('Granted admin rights successfully', decodedIdToken);
      response.status(200).send('Success');
    }
    else {
      logger.error('User is not an admin', decodedIdToken);
      response.status(403).send('Unauthorized');
    }
});

export const getUsers = onRequest({ region: 'europe-west1', cors: ['*'] }, async (request, response) => {
  const decodedIdToken = await getToken(request, response);
  if(decodedIdToken && decodedIdToken.admin) {
    const users = await auth().listUsers();
    response.status(200).send(users);
  }
  else {
    logger.error('User is not an admin', decodedIdToken);
    response.status(403).send('Unauthorized');
  }
});