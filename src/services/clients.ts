import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { firebaseDb } from "./firebase";
import type { Client } from "../types/client";

type ClientDoc = Partial<Client>;

export async function getClients() {
    const database = firebaseDb;
    const clientsQuery = await getDocs(collection(database, 'clients'));
    const response = [] as Client[];
    clientsQuery.forEach((doc) => {
        const client = doc.data() as Client;
        client.id = doc.id;
        response.push(client);
    });
    console.error(response);
    return response;
}

export async function addClient(client: Client) {
    // TODO: validation    
    const database = firebaseDb;

    const clientDoc = client as ClientDoc;
    delete clientDoc.id;
    const ref = await addDoc(collection(database, 'clients'), clientDoc);
    client.id = ref.id;
}

export async function updateClient(client: Client) {
    // TODO: validation
    const database = firebaseDb;
    const id = client.id;
    const clientDoc = {...client as ClientDoc};
    delete clientDoc.id;
    const clientRef = doc(database, 'clients', id);
    await updateDoc(clientRef, clientDoc);
}

export async function deleteClient(client: Client) {
    const database = firebaseDb;
    const clientRef = doc(database, 'clients', client.id);
    await deleteDoc(clientRef);
}