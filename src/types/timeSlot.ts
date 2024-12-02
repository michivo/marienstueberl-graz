import type { WeekDay } from "./distributionConfig";

export interface TimeSlotDay {
    weekDay: WeekDay,
    slots: TimeSlot[],
};

export interface TimeSlot {
    startTime: string,
    endTime: string,
}
