import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseDb } from "./firebase";
import type { DistributionConfig } from "../types/distributionConfig";

type DistributionConfigDoc = Partial<DistributionConfig>;

const collectionName = 'distributionConfig';
const configKey = 'graz';

export async function getConfig() {
    const database = firebaseDb;
    const configRef = doc(database, collectionName, configKey);
    const configDoc = await getDoc(configRef);
    return configDoc.data() as DistributionConfig;
}

export async function updateConfig(config: DistributionConfig) {
    // TODO: validation
    const database = firebaseDb;
    const configRef = doc(database, collectionName, configKey);
    const configDoc = {...config as DistributionConfigDoc};
    await updateDoc(configRef, configDoc);
}