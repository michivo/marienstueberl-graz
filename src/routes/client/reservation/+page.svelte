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
	import Modal from '../../../components/misc/Modal.svelte';

	let error = $state('');
	let timeSlots = $state<TimeSlotDay[]>([]);
	let bookings = $state<Booking[]>([]);
	let hasUnconfirmedError = $state(false);

	let unsubscribe = undefined as undefined | Unsubscribe;
	let configuration = undefined as undefined | DistributionConfig;

	onMount(async () => {
		configuration = await getPreviousConfig();
		timeSlots = getTimeSlots(configuration);
		unsubscribe = subscribeToBookings((b) => (bookings = b));
	});

	onDestroy(() => {
		unsubscribe?.();
		error = '';
	});

	async function makeReservation(day: WeekDay, timeSlot: TimeSlot) {
		console.log('Making reservation');
		try {
			const token = await firebaseAuth.currentUser?.getIdToken(false);
			const weekOfDay = getCurrentMonday();
			const reservationDay = getWeekdayDate(weekOfDay, day);
			const response = await fetch('http://127.0.0.1:5001/marienstueberl-graz/europe-west1/makeReservation', {
				headers: { Authorization: `Bearer ${token}` },
				method: 'POST',
				body: JSON.stringify({
					weekOf: toISODateString(weekOfDay),
					startTime: timeSlot.startTime,
					endTime: timeSlot.endTime,
					status: 'confirmed',
					date: toISODateString(reservationDay)
				})
			});
			if(!response.ok) {
				error = await response.text();
				hasUnconfirmedError = true;
			}
		} catch (ex) {
			hasUnconfirmedError = true;
			if (ex instanceof Error) {
				error = ex?.message ?? 'Unbekannter Fehler';
			} else {
				error = 'Unbekannter Fehler';
			}
			console.error(ex);
		}
	}

	function formatWeekDay(weekDay: WeekDay) {
		const date = getWeekdayDate(getCurrentMonday(), weekDay);
		return `${date.toLocaleDateString('de-AT', { weekday: 'long' })}, ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
	}

	function hasReservation(day: WeekDay, timeSlot: TimeSlot) {
		const weekOfDay = getCurrentMonday();
		const reservationDay = getWeekdayDate(weekOfDay, day);
		const reservation = bookings.find(
			(b) =>
				toISODateString(b.date) === toISODateString(reservationDay) &&
				b.startTime === timeSlot.startTime
		);
		return !!reservation;
	}

	function canMakeReservation(day: WeekDay, timeSlot: TimeSlot) {
		if (hasReservation(day, timeSlot)) {
			return false;
		}
		const numReservations = bookings.filter((b) => b.startTime === timeSlot.startTime).length;
		if (!configuration || numReservations >= configuration?.peoplePerSlot) {
			return false;
		}
	}

	function cancelReservation(day: WeekDay, timeSlot: TimeSlot) {
		console.log('Canceling reservation');
	}
</script>

<div class="container">
	{#each timeSlots as day}
		<h2>{formatWeekDay(day.weekDay)}</h2>
		<div class="day-buttons">
			{#each day.slots as timeSlot}
				{#if canMakeReservation(day.weekDay, timeSlot)}
					<button onclick={() => makeReservation(day.weekDay, timeSlot)}>
						{timeSlot.startTime} - {timeSlot.endTime}
					</button>
				{:else if hasReservation(day.weekDay, timeSlot)}
					<button onclick={() => cancelReservation(day.weekDay, timeSlot)} class="reserved">
						{timeSlot.startTime} - {timeSlot.endTime}<br />(Reserviert)
					</button>
				{:else}
					<button onclick={() => makeReservation(day.weekDay, timeSlot)}>
						{timeSlot.startTime} - {timeSlot.endTime}
					</button>
				{/if}
			{/each}
		</div>
	{/each}
	<Modal bind:showModal={hasUnconfirmedError}>
		{#snippet header()}
			<h2>Fehler bei der Reservierung</h2>
		{/snippet}
		<div class="error-details">
			Der Termin konnte nicht reserviert werden: {error}
		</div>
		<button class="confirm-button" type="submit" onclick={() => hasUnconfirmedError = false}>OK</button>
	</Modal>
</div>

<style>
	.container {
		padding: 1rem;
	}

	.day-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.day-buttons button {
		margin: 0.5rem;
		height: 5rem;
	}

	.day-buttons button.reserved {
		border: 2px solid var(--highlight-red);
	}

	.confirm-button {
		width: 100%;
	}

	.error-details {
		margin: 1rem 0;
		font-weight: 300;
	}
</style>
