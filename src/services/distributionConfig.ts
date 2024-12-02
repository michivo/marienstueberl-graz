import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebaseDb } from "./firebase";
import type { DayConfig, DistributionConfig } from "../types/distributionConfig";
import { getNextMonday, getCurrentMonday } from "../utils/dateUtils";

type DistributionConfigDoc = Partial<DistributionConfig>;

const collectionName = 'distributionConfig';
const configKeyPrefix = 'graz';

export async function getUpcomingConfig() {
    const nextMonday = getNextMonday();
    const configKey = getConfigKey(nextMonday);
    const upcomingConfig = await getConfig(configKey);
    console.error('upcomingConfig');
    console.error(upcomingConfig);
    if (!upcomingConfig) {
        const previousConfig = await getPreviousConfig();
        await upsertConfig(previousConfig);
        return previousConfig;
    }
    return upcomingConfig;
}

export async function getPreviousConfig(): Promise<DistributionConfig> {
    const previousMonday = getCurrentMonday();
    const configKey = getConfigKey(previousMonday);
    const result = await getConfig(configKey);
    if (!result) {
        const emptyDay: DayConfig = { enabled: false };
        return {
            timeSlotsPerHour: 4,
            peoplePerSlot: 3,
            monday: { ...emptyDay },
            tuesday: { ...emptyDay },
            wednesday: { ...emptyDay },
            thursday: { ...emptyDay },
            friday: { ...emptyDay },
            saturday: { ...emptyDay },
            sunday: { ...emptyDay },
        }
    }
    return result;
}

async function getConfig(configKey: string) {
    const database = firebaseDb;
    console.error(configKey);
    const configRef = doc(database, collectionName, configKey);
    const configDoc = await getDoc(configRef);
    return configDoc.data() as DistributionConfig;
}

function getConfigKey(date: Date) {
    const configKey = `${configKeyPrefix}-${date.toISOString().slice(0, 10)}`;
    return configKey;
}

export async function upsertConfig(config: DistributionConfig) {
    // TODO: validation
    const database = firebaseDb;
    const nextMonday = getNextMonday();
    const configKey = getConfigKey(nextMonday);
    const configRef = doc(database, collectionName, configKey);
    const configDoc = { ...config as DistributionConfigDoc };
    await setDoc(configRef, configDoc);
}