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
	import Spinner from '../../../components/misc/Spinner.svelte';
	import { getFunctionUris } from '../../../services/functionUris';
	import { page } from '$app/stores';

	let error = $state('');
	let timeSlots = $state<TimeSlotDay[]>([]);
	let bookings = $state<Booking[]>([]);
	let hasUnconfirmedError = $state(false);
	let configuration = $state<DistributionConfig | undefined>(undefined);
	let loading = $state(false);

	const hasAnyReservation = $derived(() => bookings.find(
			(b) => b.client.email === firebaseAuth.currentUser?.email
		)
	);

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

	async function makeReservation(day: WeekDay, timeSlot: TimeSlot) {
		loading = true;
		try {
			const token = await firebaseAuth.currentUser?.getIdToken(false);
			const weekOfDay = getCurrentMonday();
			const reservationDay = getWeekdayDate(weekOfDay, day);
			console.log('Making reservation', reservationDay, timeSlot);
			const response = await fetch(getFunctionUris($page.url.origin).makeReservation,
				{
					headers: { Authorization: `Bearer ${token}` },
					method: 'POST',
					body: JSON.stringify({
						weekOf: toISODateString(weekOfDay),
						startTime: timeSlot.startTime,
						endTime: timeSlot.endTime,
						status: 'confirmed',
						date: toISODateString(reservationDay)
					})
				}
			);
			if (!response.ok) {
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
		} finally {
			loading = false;
		}
	}

	async function cancelReservation() {
		loading = true;
		console.log('Cancelling reservation');
		try {
			const token = await firebaseAuth.currentUser?.getIdToken(false);
			const weekOfDay = getCurrentMonday();
			const response = await fetch(getFunctionUris($page.url.origin).cancelReservation,
				{
					headers: { Authorization: `Bearer ${token}` },
					method: 'POST',
					body: JSON.stringify({
						weekOf: toISODateString(weekOfDay)
					})
				}
			);
			if (!response.ok) {
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
		} finally {
			loading = false;
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
				b.startTime === timeSlot.startTime &&
				b.client.email === firebaseAuth.currentUser?.email
		);
		return !!reservation;
	}

	function canMakeReservation(day: WeekDay, timeSlot: TimeSlot) {

		const weekOfDay = getCurrentMonday();
		const reservationDay = getWeekdayDate(weekOfDay, day);
		const numReservations = bookings.filter(
			(b) =>
				toISODateString(b.date) === toISODateString(reservationDay) &&
				b.startTime === timeSlot.startTime
		).length;
		if (!configuration || numReservations >= configuration?.peoplePerSlot) {
			console.log('No more reservations allowed');
			return false;
		}
		return true;
	}

	function getBookingCount(day: WeekDay, timeSlot: TimeSlot) {
		const weekOfDay = getCurrentMonday();
		const reservationDay = getWeekdayDate(weekOfDay, day);
		const numReservations = bookings.filter(
			(b) =>
				toISODateString(b.date) === toISODateString(reservationDay) &&
				b.startTime === timeSlot.startTime
		).length;
		return numReservations;
	}
</script>

<div class="container">
	<h1>Reservierung</h1>
	{#if loading}
		<Spinner />
	{:else}
		{#each timeSlots as day}
			<h2>{formatWeekDay(day.weekDay)}</h2>
			<div class="day-buttons">
				{#each day.slots as timeSlot}
					{#if canMakeReservation(day.weekDay, timeSlot) && !hasAnyReservation}
						<button onclick={() => makeReservation(day.weekDay, timeSlot)}>
							{timeSlot.startTime} - {timeSlot.endTime}<br />
							{#if configuration?.peoplePerSlot}
								<span class="free-info">
									{configuration.peoplePerSlot - getBookingCount(day.weekDay, timeSlot)} / {configuration.peoplePerSlot}
									frei
								</span>
							{/if}
						</button>
					{:else if hasReservation(day.weekDay, timeSlot)}
						<button onclick={() => cancelReservation()} class="reserved">
							{timeSlot.startTime} - {timeSlot.endTime}<br />(Reserviert)
						</button>
					{:else}
						<button disabled>
							{timeSlot.startTime} - {timeSlot.endTime}<br />
							{#if !hasAnyReservation}
								<span class="free-info">(Ausgebucht)</span>
							{/if}
						</button>
					{/if}
				{/each}
			</div>
		{/each}
	{/if}
	<Modal bind:showModal={hasUnconfirmedError}>
		{#snippet header()}
			<h2>Fehler bei der Reservierung</h2>
		{/snippet}
		<div class="error-details">
			Der Termin konnte nicht reserviert werden: {error}
		</div>
		<button class="confirm-button" type="submit" onclick={() => (hasUnconfirmedError = false)}>
			OK
		</button>
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

	button:disabled {
		background-color: var(--secondary-light);
		color: var(--secondary-dark);
		cursor: not-allowed;
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

	.free-info {
		font-size: 0.9rem;
		font-weight: 300;
	}
</style>
