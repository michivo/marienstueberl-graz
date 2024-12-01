import { expect, test } from 'vitest';
import { getNextMonday, getPreviousMonday } from '../../src/utils/dateUtils';

test('getNextMonday on a Sunday returns following Monday', () => {
	const date = new Date(2024, 11, 1);

    const nextMonday = getNextMonday(date);
    
    expect(nextMonday).toEqual(new Date(2024, 11, 2));
    expect(nextMonday.getDay()).toEqual(1);    
});

test('getNextMonday on a Monday returns same day', () => {
	const date = new Date(2024, 11, 2);

    const nextMonday = getNextMonday(date);
    
    expect(nextMonday).toEqual(new Date(2024, 11, 2));
    expect(nextMonday.getDay()).toEqual(1);
});

test('getNextMonday on a Tuesday returns following Monday', () => {
	const date = new Date(2024, 11, 3);

    const nextMonday = getNextMonday(date);
    
    expect(nextMonday).toEqual(new Date(2024, 11, 9));
    expect(nextMonday.getDay()).toEqual(1);
});

test('getPreviousMonday on a Sunday returns following Monday', () => {
	const date = new Date(2024, 11, 1);

    const previousMonday = getPreviousMonday(date);
    
    expect(previousMonday).toEqual(new Date(2024, 10, 25));
    expect(previousMonday.getDay()).toEqual(1);    
});

test('getPreviousMonday on a Monday returns previous Monday', () => {
	const date = new Date(2024, 11, 2);

    const previousMonday = getPreviousMonday(date);
    
    expect(previousMonday).toEqual(new Date(2024, 10, 25));
    expect(previousMonday.getDay()).toEqual(1);
});

test('getPreviousMonday on a Tuesday returns following Monday', () => {
	const date = new Date(2024, 11, 3);

    const previousMonday = getPreviousMonday(date);
    
    expect(previousMonday).toEqual(new Date(2024, 11, 2));
    expect(previousMonday.getDay()).toEqual(1);
});