<script lang="ts">
	import { onMount } from 'svelte';
	import { authProviders, firebaseAuth } from '../services/firebase';
	import { browser } from '$app/environment';
	import { currentUser } from '../stores/currentUser';
	import { goto } from '$app/navigation';
	import Spinner from '../components/misc/Spinner.svelte';
	import { getIdTokenResult } from 'firebase/auth';

	let firebaseUi = undefined as undefined | any;

	onMount(async () => {
		if ($currentUser.state === 'loggedOut') {
			const firebaseUi = await firebaseAuthUi();
			if (firebaseUi) {
				firebaseUi.start('#firebaseui-auth-container', {
					signInOptions: authProviders
				});
			}
		}
	});

	currentUser.subscribe(async (value) => {
		if (value.state === 'loggedIn' && value.user) {
			const idToken = await getIdTokenResult(value.user);
			if (idToken.claims['admin']) {
				goto('/admin/clients');
			} else if (idToken.claims['privilegedUser']) {
				goto('/handout');
			} else {
				goto('/client');
			}
		}
		else if(value.state === 'loggedOut') {
			const firebaseUi = await firebaseAuthUi();
			if (firebaseUi) {
				firebaseUi.start('#firebaseui-auth-container', {
					signInOptions: authProviders
				});
			}
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
