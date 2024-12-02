import type { WeekDay } from "./distributionConfig";

export interface TimeSlot {
    startTime: string,
    endTime: string,
    weekDay: WeekDay,
};
