<script lang="ts">
	import { onMount } from 'svelte';
	import { getPreviousConfig } from '../../../services/distributionConfig';
	import { firebaseAuth } from '../../../services/firebase';
	import { getTimeSlots } from '../../../utils/configUtils';
	import type { TimeSlotDay } from '../../../types/timeSlot';
	import { getCurrentMonday, getWeekdayDate } from '../../../utils/dateUtils';
	import type { WeekDay } from '../../../types/distributionConfig';

	let error = '';

	let timeSlots = $state<TimeSlotDay[]>([]);

	onMount(async () => {
		const configuration = await getPreviousConfig();
		timeSlots = getTimeSlots(configuration);
	});

	async function makeReservation() {
		console.log('Making reservation');
		// http://127.0.0.1:5001/marienstueberl-graz/europe-west1/makeReservation
		try {
			const token = await firebaseAuth.currentUser?.getIdToken(false);
			await fetch(
				'http://127.0.0.1:5001/marienstueberl-graz/europe-west1/makeReservation',
				{
					headers: { Authorization: `Bearer ${token}` },
                    method: 'POST',
                    body: JSON.stringify({
                        weekOf: '2024-12-02',
                        startTime: '09:30',
                        endTime: '09:45',
                        status: 'confirmed',
                        date: '2024-12-05',
                    }),
				},
			);
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

<div>
	{#each timeSlots as day}
		<h2>{formatWeekDay(day.weekDay)}</h2>
		{#each day.slots as timeSlot}
			<p>{timeSlot.startTime} - {timeSlot.endTime}</p>
		{/each}
	{/each}
	<button onclick={makeReservation}>Make Reservation</button>
</div>
