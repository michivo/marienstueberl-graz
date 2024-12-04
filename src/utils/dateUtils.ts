import { WEEKDAY, type WeekDay } from '../types/distributionConfig';
import type { PickUpState } from '../types/pickUpState';

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

export function toISODateString(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`;
}

export function getPickupState(pickupStartDate: Date, pickupEndDate: Date) : PickUpState {
  const today = new Date();
  if(pickupStartDate.getFullYear() !== today.getFullYear() || pickupStartDate.getMonth() !== today.getMonth() || pickupStartDate.getDate() !== today.getDate()) {
      if(pickupStartDate.getTime() < today.getTime()) {
          return 'late';
      }
      return 'early';
  }
  const diffStartMinutes = (pickupStartDate.getTime() - today.getTime()) / 1000 / 60;
  if(diffStartMinutes > 15) {
      return 'early';
  }
  const diffEndMinutes = (pickupEndDate.getTime() - today.getTime()) / 1000 / 60;
  if(diffEndMinutes < -15) {
      return 'late';
  }
  return 'onTime';
}