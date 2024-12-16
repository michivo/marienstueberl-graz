<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { currentUser } from '../../../stores/currentUser';
	import { getBookingById, markBookingAsPickedUp } from '../../../services/bookings';
	import type { BookingWithId } from '../../../types/booking';
	import Spinner from '../../../components/misc/Spinner.svelte';

	let pickUpConfirmed = $state(false);
	let loading = $state(true);
	let booking = $state<undefined | BookingWithId>(undefined);

	onMount(async () => {
		const pickUpId = $page.url.searchParams.get('id') ?? '';
		loading = true;
		try {
			if ($currentUser.user && pickUpId) {
				await markBookingAsPickedUp(pickUpId);
				pickUpConfirmed = true;
				booking = await getBookingById(pickUpId);
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	});

	currentUser.subscribe(async (value) => {
		if(pickUpConfirmed) {
			return;
		}
		try {
			const pickUpId = $page.url.searchParams.get('id') ?? '';
			if (value.user && pickUpId) {
				await markBookingAsPickedUp(pickUpId);
				pickUpConfirmed = true;
				booking = await getBookingById(pickUpId);
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	});

</script>

<div class="container">
	<div class="label">
		<div>Marienstüberl</div>
	</div>
	{#if loading}
		<Spinner />
	{:else if pickUpConfirmed && booking}
		<div class="state valid">Abholung bestätigt</div>
		<div class="booking-info">
			<div class="client-name">
				{booking.client.name}
			</div>
			<div class="client-info">
				P: {booking.client.peopleCount}, K: {booking.client.childrenCount}
			</div>
			<div class="client-expiry">
				Berechtigt bis {booking.client.validThrough}
			</div>
			<div class="client-issuer">Ausstellende Stelle: <span class="issuer">{booking.client.issuer}</span></div>
		</div>
	{:else}
		<div class="state invalid">Abholung konnte nicht bestätigt werden</div>
	{/if}
</div>

<style lang="scss" scoped>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		gap: 2rem;

		font-size: 1.5rem;

		.label {
			font-size: 1.5rem;
			font-weight: 300;
			text-align: center;
		}

		div.state {
			border-radius: 0.25rem;
			border-style: solid;
			border-width: 2px;
			padding: 1rem;

			&.invalid {
				border-color: red;
				background-color: #fdd;
			}

			&.valid {
				border-color: green;
				background-color: #dfd;
			}
		}

		div.booking-info {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.25rem;

			.client-name {
				font-size: 1.25rem;
				font-weight: 300;
			}

			.client-info {
				font-size: 1rem;
				font-weight: 600;
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
	}
</style>
