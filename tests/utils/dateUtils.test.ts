import { expect, test } from 'vitest';
import { getNextMonday, getCurrentMonday, getPickupState } from '../../src/utils/dateUtils';

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
    
    expect(currentMonday).toEqual(new Date(2024, 11, 2));
    expect(currentMonday.getDay()).toEqual(1);
});

test('getPickupState days before pickup start returns early', () => {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 100);
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 101);

    const state = getPickupState(startDate, endDate);

    expect(state).toEqual('early');
});

test('getPickupState hours before pickup start returns early', () => {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 2);
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 2.5);

    const state = getPickupState(startDate, endDate);

    expect(state).toEqual('early');
});

test('getPickupState 30 minutes before pickup start returns early', () => {
    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() + 30);
    const endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() + 45);

    const state = getPickupState(startDate, endDate);

    expect(state).toEqual('early');
});


test('getPickupState 14 minutes before pickup start returns on time', () => {
    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() + 14);
    const endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() + 29);

    const state = getPickupState(startDate, endDate);

    expect(state).toEqual('onTime');
});

test('getPickupState in time frame returns on time', () => {
    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 3);
    const endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() + 12);

    const state = getPickupState(startDate, endDate);

    expect(state).toEqual('onTime');
});

test('getPickupState 10 minutes late returns on time', () => {
    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 25);
    const endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() - 10);

    const state = getPickupState(startDate, endDate);

    expect(state).toEqual('onTime');
});

test('getPickupState 20 minutes late returns late', () => {
    const startDate = new Date();
    startDate.setMinutes(startDate.getMinutes() - 35);
    const endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() - 20);

    const state = getPickupState(startDate, endDate);

    expect(state).toEqual('late');
});

test('getPickupState hours late returns late', () => {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 3);
    const endDate = new Date();
    endDate.setHours(endDate.getHours() - 2);

    const state = getPickupState(startDate, endDate);

    expect(state).toEqual('late');
});

test('getPickupState days late returns late', () => {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 43);
    const endDate = new Date();
    endDate.setHours(endDate.getHours() - 42);

    const state = getPickupState(startDate, endDate);

    expect(state).toEqual('late');
});