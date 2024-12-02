import { WEEKDAY, type DistributionConfig } from "../types/distributionConfig";
import type { TimeSlot, TimeSlotDay } from "../types/timeSlot";

export function getTimeSlots(config: DistributionConfig) : TimeSlotDay[] {
    const timeSlots: TimeSlotDay[] = [];
    for (const day of WEEKDAY) {
        const dayConfig = config[day];
        if(dayConfig.enabled === false || dayConfig.startTime === undefined || dayConfig.endTime === undefined) {
            continue;
        }
        const slots: TimeSlot[] = [];
        timeSlots.push({
            weekDay: day,
            slots,
        });
        let startTime = getMinutes(dayConfig.startTime);
        const endTime = getMinutes(dayConfig.endTime);
        const slotLength = 60 / config.timeSlotsPerHour;
        while(startTime < endTime) {
            slots.push({
                startTime: `${Math.floor(startTime / 60).toString().padStart(2, '0')}:${(startTime % 60).toString().padStart(2, '0')}`,
                endTime: `${Math.floor((startTime + slotLength) / 60).toString().padStart(2, '0')}:${((startTime + slotLength) % 60).toString().padStart(2, '0')}`,
            });
            startTime += slotLength;
        }

    }
    return timeSlots;
}

function getMinutes(timeStamp: string) {
    const time = timeStamp.split(':');
    return parseInt(time[0]) * 60 + parseInt(time[1]);
}