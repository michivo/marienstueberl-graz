<script lang="ts">
	import { onMount } from 'svelte';
	import { authProviders, firebaseAuth } from '../services/firebase';
	import { browser } from '$app/environment';
	import { currentUser } from '../stores/currentUser';
	import { goto } from '$app/navigation';
	import Spinner from '../components/misc/Spinner.svelte';

	let firebaseUi = undefined as undefined | any;

	onMount(async () => {
		const firebaseUi = await firebaseAuthUi();
		if (firebaseUi) {
			firebaseUi.start('#firebaseui-auth-container', {
				signInOptions: authProviders,
			});
		}
	});

	currentUser.subscribe((value) => {
		if (value.state === 'loggedIn') {
			goto('/admin');
		}
	});

	async function firebaseAuthUi() {
		if (browser && !firebaseUi) {
            const firebaseui = await import('firebaseui');
			firebaseUi = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebaseAuth);
		}
		return firebaseUi;
	}
</script>

<div class="landing-content">
{#if $currentUser.state === 'pending'}
	<div>Lade...</div>
	<Spinner />
{:else if $currentUser.state === 'loggedOut'}
	<div id="firebaseui-auth-container"></div>
{/if}
</div>

<style lang="scss">
	@import '/css/firebase-ui.css';

	.landing-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		gap: 2rem;

		div {
			width: 30rem;
			max-width: 100%;
		}
	}
</style>

