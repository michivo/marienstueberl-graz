<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getPreviousConfig } from '../../../services/distributionConfig';
	import { firebaseAuth } from '../../../services/firebase';
	import { getTimeSlots } from '../../../utils/configUtils';
	import type { TimeSlot, TimeSlotDay } from '../../../types/timeSlot';
	import { getCurrentMonday, getWeekdayDate, toISODateString } from '../../../utils/dateUtils';
	import type { DistributionConfig, WeekDay } from '../../../types/distributionConfig';
	import type { Unsubscribe } from 'firebase/firestore';
	import { subscribeToBookings } from '../../../services/bookings';
	import type { Booking } from '../../../types/booking';

	let error = $state('');
	let timeSlots = $state<TimeSlotDay[]>([]);
	let bookings = $state<Booking[]>([]);
	let configuration = $state<DistributionConfig | undefined>(undefined);

    let bookingsByDay = $derived.by(() => {
        return timeSlots.map((day) => {
		const weekOfDay = getCurrentMonday();
		const reservationDay = getWeekdayDate(weekOfDay, day.weekDay);
		const bookingsForDay = bookings
			.filter((b) => toISODateString(b.date) === toISODateString(reservationDay))
			.sort((a, b) => {
				if (a.startTime === b.startTime) {
					return a.client.name.localeCompare(b.client.name);
				}
				return a.startTime.localeCompare(b.startTime);
			});
		return { weekDay: day.weekDay, bookings: bookingsForDay};
        });
    });

	let unsubscribe = undefined as undefined | Unsubscribe;

	onMount(async () => {
		configuration = await getPreviousConfig();
		timeSlots = getTimeSlots(configuration);
		unsubscribe = subscribeToBookings((b) => (bookings = b));
	});

	onDestroy(() => {
		unsubscribe?.();
		error = '';
	});

	function formatWeekDay(weekDay: WeekDay) {
		const date = getWeekdayDate(getCurrentMonday(), weekDay);
		return `${date.toLocaleDateString('de-AT', { weekday: 'long' })}, ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
	}
</script>

<div class="container">
	<h1>Wochenübersicht</h1>
	{#each bookingsByDay as day}
		<h2>{formatWeekDay(day.weekDay)}</h2>
		<div class="day-overview">
			{#each day.bookings as booking, index}
				<div
					class="booking"
					class:confirmed={booking.status === 'confirmed'}
					class:picked-up={booking.status === 'pickedUp'}
                    class:first-for-time={index === 0 || day.bookings[index - 1].startTime !== booking.startTime}
				>
					<span class="times">{booking.startTime} - {booking.endTime}</span>
                    <span class="client-name">{booking.client.name}</span>
					<span class="status">({booking.status === 'confirmed'
							? 'Reserviert'
							: booking.status === 'pickedUp'
								? 'Abgeholt'
								: 'Storniert'})
                    </span>
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.container {
		padding: 1rem;
	}

	.day-overview {
		display: flex;
		flex-direction: column;
	}

	.booking {
		display: grid;
		grid-template-columns: 10rem 25rem 10rem;
		padding: 0.5rem;
		border-bottom: 1px solid black;

        &.first-for-time {
            border-top: 1px solid black;
            margin-top: 0.5rem;
        }

		&.confirmed {
            border-left: 5px solid #ffcc00;
		}

		&.picked-up {
			border-left: 5px solid #00aa00;
		}

		.times {
			font-weight: bold;
		}

		.status {
			font-size: 0.9rem;
            color: var(--secondary-dark);
		}
	}
</style>
