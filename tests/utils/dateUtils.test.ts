import { expect, test } from 'vitest';
import { getNextMonday, getCurrentMonday } from '../../src/utils/dateUtils';

test('getNextMonday on a Friday returns following Monday', () => {
	const date = new Date(2024, 10, 29);

    const nextMonday = getNextMonday(date);
    
    expect(nextMonday).toEqual(new Date(2024, 11, 2));
    expect(nextMonday.getDay()).toEqual(1);    
});

test('getNextMonday on a Saturday returns following Monday', () => {
	const date = new Date(2024, 10, 30);

    const nextMonday = getNextMonday(date);
    
    expect(nextMonday).toEqual(new Date(2024, 11, 2));
    expect(nextMonday.getDay()).toEqual(1);    
});

test('getNextMonday on a Sunday returns Monday after following Monday', () => {
	const date = new Date(2024, 11, 1);

    const nextMonday = getNextMonday(date);
    
    expect(nextMonday).toEqual(new Date(2024, 11, 9));
    expect(nextMonday.getDay()).toEqual(1);    
});

test('getNextMonday on a Monday returns following Monday', () => {
	const date = new Date(2024, 11, 2);

    const nextMonday = getNextMonday(date);
    
    expect(nextMonday).toEqual(new Date(2024, 11, 9));
    expect(nextMonday.getDay()).toEqual(1);
});

test('getNextMonday on a Tuesday returns following Monday', () => {
	const date = new Date(2024, 11, 3);

    const nextMonday = getNextMonday(date);
    
    expect(nextMonday).toEqual(new Date(2024, 11, 9));
    expect(nextMonday.getDay()).toEqual(1);
});

test('getCurrentMonday on a Sunday returns following Monday', () => {
	const date = new Date(2024, 11, 1);

    const currentMonday = getCurrentMonday(date);
    
    expect(currentMonday).toEqual(new Date(2024, 11, 2));
    expect(currentMonday.getDay()).toEqual(1);    
});

test('getCurrentMonday on a Monday returns that Monday', () => {
	const date = new Date(2024, 11, 2);

    const currentMonday = getCurrentMonday(date);
    
    expect(currentMonday).toEqual(new Date(2024, 11, 2));
    expect(currentMonday.getDay()).toEqual(1);
});

test('getCurrentMonday on a Tuesday returns following Monday', () => {
	const date = new Date(2024, 11, 3);

    const currentMonday = getCurrentMonday(date);
    console.error(currentMonday);
    console.error(date);
    
    expect(currentMonday).toEqual(new Date(2024, 11, 2));
    expect(currentMonday.getDay()).toEqual(1);
});