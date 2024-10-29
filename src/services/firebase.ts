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
import { doc, getDoc } from "firebase/firestore";
import type { UserRole } from "../types/userInfo";

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
export const logOut = () => signOut(firebaseAuth);
firebaseAuth.languageCode = 'de-AT';

await updateUser(firebaseAuth.currentUser);
firebaseAuth.onAuthStateChanged(async (user) => {
    await updateUser(user);
});

export const authProviders = [
    {
        provider: EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: true,
    },
    GoogleAuthProvider.PROVIDER_ID,
];

export const firebaseDb = getFirestore();

export async function getUserDetails(uid: string) : Promise<UserRole> {
    const database = firebaseDb;
    const userRef = doc(database, 'users', uid);
    const userInfo = await getDoc(userRef);
    if(userInfo.exists()) {
        return userInfo.data().role;
    }
    return undefined;
}

async function updateUser(user: User | null) {
    if (!user) {
        currentUser.set(null);
    }
    else {
        const role = await getUserDetails(user.uid);
        currentUser.set({ ...user, role });
    }
}