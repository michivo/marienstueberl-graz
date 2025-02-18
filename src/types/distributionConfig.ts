export interface DistributionConfig {
    monday: DayConfig;
    tuesday: DayConfig;
    wednesday: DayConfig;
    thursday: DayConfig;
    friday: DayConfig;
    saturday: DayConfig;
    sunday: DayConfig;

    timeSlotsPerHour: number;
    peoplePerSlot: number;
}

export interface DayConfig {
    enabled: boolean;
    startTime?: string;
    endTime?: string;
}

export const WEEKDAY = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
export type WeekDay = typeof WEEKDAY[number];