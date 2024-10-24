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
} from 'firebase/auth';
import { UserStore } from '../stores/userStore';

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
provider.setCustomParameters({ prompt: 'select_account',  });

export const firebaseAuth = getAuth();
export const logOut = () => signOut(firebaseAuth);
firebaseAuth.languageCode = 'de-AT';
UserStore.set(firebaseAuth.currentUser);
firebaseAuth.onAuthStateChanged((user) => {
    UserStore.set(user);
});
export const authProviders = [
    {
        provider: EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true,
    },
    GoogleAuthProvider.PROVIDER_ID,
];