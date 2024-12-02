<script lang="ts">
	import { onMount } from 'svelte';
	import { getPreviousConfig } from '../../../services/distributionConfig';
	import { firebaseAuth } from '../../../services/firebase';
	import { getTimeSlots } from '../../../utils/configUtils';

	let error = '';

	onMount(async () => {
		const configuration = await getPreviousConfig();
		const timeSlots = getTimeSlots(configuration);
		console.error(timeSlots);
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
</script>

<div>

	<button onclick={makeReservation}>Make Reservation</button>
</div>
