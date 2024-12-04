import { addDoc, collection, deleteDoc, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import { firebaseDb } from "./firebase";
import type { Client } from "../types/client";
import type { User } from "firebase/auth";

type ClientDoc = Partial<Client>;

const collectionName = 'clients';

export async function getClients() {
    const database = firebaseDb;
    const clientsQuery = await getDocs(collection(database, collectionName));
    const response = [] as Client[];
    clientsQuery.forEach((doc) => {
        const client = doc.data() as Client;
        client.id = doc.id;
        response.push(client);
    });
    return response;
}

export async function addClient(client: Client) {
    // TODO: validation    
    // TODO: create a new user in firebase auth
    const database = firebaseDb;

    const clientDoc = client as ClientDoc;
    delete clientDoc.id;
    const ref = await addDoc(collection(database, collectionName), clientDoc);
    client.id = ref.id;
}

export async function getClient(user: User) : Promise<Client | undefined> {
    const database = firebaseDb;
    const clientsCollection = collection(database, collectionName);
    const clientsQuery = query(clientsCollection, where('email', '==', user.email), limit(1));
    const snapshot = await getDocs(clientsQuery);
    if(snapshot.empty) {
        return undefined;
    }

    const doc = snapshot.docs[0].data() as Client;
    doc.id = snapshot.docs[0].id;
    return doc;
}

export async function updateClient(client: Client) {
    // TODO: validation
    // TODO: update user in firebase auth
    const database = firebaseDb;
    const id = client.id;
    const clientDoc = {...client as ClientDoc};
    delete clientDoc.id;
    const clientRef = doc(database, collectionName, id);
    await updateDoc(clientRef, clientDoc);
}

export async function deleteClient(client: Client) {
    const database = firebaseDb;
    const clientRef = doc(database, collectionName, client.id);
    await deleteDoc(clientRef);
}