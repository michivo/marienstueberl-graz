<script lang="ts">
	import { currentUser } from '../../../stores/currentUser';
	import type { BookingWithId } from '../../../types/booking';
	import { getCurrentBooking } from '../../../services/bookings';
	import { getPickupState, toISODateString } from '../../../utils/dateUtils';
	import { getClient } from '../../../services/clients';
	import type { Client } from '../../../types/client';
	import QRCode from '@castlenine/svelte-qrcode';
	import { page } from '$app/stores';

	let booking = $state<undefined | BookingWithId>(undefined);
	let loading = $state(false);
	let client = $state<undefined | Client>(undefined);

	let pickupState = $derived.by<{ message: string; uri?: string }>(() => {
		if ($currentUser.state === 'loggedOut') {
			return { message: 'Nicht angemeldet' };
		} else if ($currentUser.state === 'pending') {
			return { message: 'Anmeldedaten werden geladen...' };
		}
		if (loading) {
			return { message: 'Lade Abholberechtigung...' };
		}

		if (!booking) {
			return { message: 'Keine Abholberechtigung in dieser Woche gefunden.' };
		}

		if (booking.status === 'pickedUp') {
			return { message: 'Lebensmittel bereits abgeholt.' };
		}
		if (booking.status === 'cancelled') {
			return { message: 'Abholberechtigung storniert.' };
		}
		const pickupStartDate = new Date(booking.date);
		const pickupEndDate = new Date(booking.date);
		const pickupStartTime = booking.startTime.split(':');
		const pickupEndTime = booking.endTime.split(':');
		pickupStartDate.setHours(parseInt(pickupStartTime[0]), parseInt(pickupStartTime[1]));
		pickupEndDate.setHours(parseInt(pickupEndTime[0]), parseInt(pickupEndTime[1]));
		const pickupState = getPickupState(pickupStartDate, pickupEndDate);
		if (pickupState === 'early') {
			return {
				message: `Abholberechtigt ab ${pickupStartDate.toLocaleDateString('de-AT')}, ${pickupStartDate.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })}`
			};
		}
		if (pickupState === 'late') {
			return {
				message: `Abholberechtigung am ${pickupEndDate.toLocaleDateString('de-AT')}, ${pickupEndDate.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })} abgelaufen.`
			};
		} else {
			const baseUri = $page.url.origin;
			const targetUri = `${baseUri}/handout/by-id?id=${booking.id}`;
			return {
				message: `Abholberechtigt bis ${pickupEndDate.toLocaleDateString('de-AT')}, ${pickupEndDate.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })}`,
				uri: targetUri
			};
		}
	});

	currentUser.subscribe(async (value) => {
		if (value.user) {
			loading = true;
			try {
				booking = await getCurrentBooking(value.user);
				client = await getClient(value.user);
			} finally {
				loading = false;
			}
		}
	});
</script>

<div class="container">
	<h1>Abholung</h1>
	<div class="pickup-state">{pickupState.message}</div>
	{#if client}
		<div class="client-info">
			<div class="client-name">{client.name}</div>
			<div class="client-people">P: {client.peopleCount}, K: {client.childrenCount}</div>
			<div class="client-expiry">Berechtigt bis {client.validThrough}</div>
			<div class="client-issuer">Ausstellende Stelle: <span class="issuer">{client.issuer}</span></div>
		</div>
	{/if}
	{#if pickupState.uri}
		<QRCode bind:data={pickupState.uri} />
		<div class="pickup-link">
			<a href={pickupState.uri} target="_blank">{booking?.id.substring(0, 6)}</a>
		</div>
	{/if}
</div>

<style scoped>
	.container {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	h1 {
		margin: 0;
	}

	.pickup-state {
		font-size: 1.5rem;
	}

	.client-info {
		border: 1px solid var(--dark);
		border-radius: 0.25rem;
		padding: 0.25rem;
		text-align: center;

		.client-name {
			font-size: 1.1rem;
		}

		.client-people {
			font-weight: 900;
		}

		.client-expiry {
			font-size: 0.9rem;
			color: var(--secondary-dark);
		}
		
		.client-issuer {
			font-size: 0.9rem;
			color: black;

			.issuer {
				font-weight: 700;
			}
		}
	}

	div.pickup-link a {
		font-size: 0.9rem;
	}
</style>
