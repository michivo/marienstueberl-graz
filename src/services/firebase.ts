import {
    PUBLIC_FIREBASE_API_KEY,
    PUBLIC_FIREBASE_AUTH_DOMAIN,
    PUBLIC_PROJECT_ID,
    PUBLIC_MESSAGING_SENDER_ID,
    PUBLIC_APP_ID,
    PUBLIC_STORAGE_BUCKET
} from '$env/static/public';

import { initializeApp } from 'firebase/app';
import {
    EmailAuthProvider,
    getAuth,
    GoogleAuthProvider,
    signOut,
    type User,
} from 'firebase/auth';
import { currentUser } from '../stores/currentUser';
import { getFirestore } from 'firebase/firestore';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

const firebaseConfig = {
    apiKey: PUBLIC_FIREBASE_API_KEY,
    authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: PUBLIC_PROJECT_ID,
    messagingSenderId: PUBLIC_MESSAGING_SENDER_ID,
    appId: PUBLIC_APP_ID,
    storageBucket: PUBLIC_STORAGE_BUCKET,
};

export const app = initializeApp(firebaseConfig);

export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account', });

export const firebaseAuth = getAuth();
export async function logOut(): Promise<void> {
    console.log('Logging out');
    currentUser.set({state: 'loggedOut'});
    await signOut(firebaseAuth);
    goto('/');
}

firebaseAuth.languageCode = 'de';

if (firebaseAuth.currentUser) {
    updateUser(firebaseAuth.currentUser);
}
firebaseAuth.onAuthStateChanged(async (user) => {
    await updateUser(user);
});

export const authProviders = [
    {
        provider: EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true,
    },
];

export const firebaseDb = getFirestore();

async function updateUser(user: User | null) {
    if(!browser) {
        return;
    }
    await firebaseAuth.authStateReady();
    if (!user) {
        currentUser.set({state: 'loggedOut'});
    }
    else {
        currentUser.set({user, state: 'loggedIn'});
    }
}