<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getPreviousConfig } from '../../../services/distributionConfig';
	import { firebaseAuth } from '../../../services/firebase';
	import { getTimeSlots } from '../../../utils/configUtils';
	import type { TimeSlot, TimeSlotDay } from '../../../types/timeSlot';
	import { getCurrentMonday, getWeekdayDate, toISODateString } from '../../../utils/dateUtils';
	import type { WeekDay } from '../../../types/distributionConfig';

	let error = '';

	let timeSlots = $state<TimeSlotDay[]>([]);

	onMount(async () => {
		const configuration = await getPreviousConfig();
		timeSlots = getTimeSlots(configuration);
	});

	onDestroy(() => {
		error = '';
	});

	async function makeReservation(day: WeekDay, timeSlot: TimeSlot) {
		console.log('Making reservation');
		try {
			const token = await firebaseAuth.currentUser?.getIdToken(false);
			const weekOfDay = getCurrentMonday();
			const reservationDay = getWeekdayDate(weekOfDay, day);
			await fetch('http://127.0.0.1:5001/marienstueberl-graz/europe-west1/makeReservation', {
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
		} catch (ex) {
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
</script>

<div class="container">
	{#each timeSlots as day}
		<h2>{formatWeekDay(day.weekDay)}</h2>
		<div class="day-buttons">
			{#each day.slots as timeSlot}
				<button onclick={() => makeReservation(day.weekDay, timeSlot)}>{timeSlot.startTime} - {timeSlot.endTime}</button>
			{/each}
		</div>
	{/each}
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
		padding: 1.5rem 1rem;
	}
</style>
