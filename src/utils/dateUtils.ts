import { WEEKDAY, type WeekDay } from "../types/distributionConfig";

export function getNextMonday(currentDate: Date | undefined = undefined) {
  const d = currentDate ?? new Date();
  const addWeek = d.getDay() < 2;
  d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7 + (addWeek ? 7 : 0));
  return d;
}

export function getCurrentMonday(currentDate: Date | undefined = undefined) {
  const d = getNextMonday(currentDate);
  d.setDate(d.getDate() - 7);
  return d;
}

export function getWeekdayDate(startDate: Date, weekDay: WeekDay) {
  const d = new Date(startDate);
  const dayIndex = WEEKDAY.indexOf(weekDay) % 7;
  d.setDate(d.getDate() + dayIndex);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toISODateString(date: Date) {
  return date.toISOString().split('T')[0];
}