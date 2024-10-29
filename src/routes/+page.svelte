<script lang="ts">
	import { onMount } from 'svelte';
	import { authProviders, firebaseAuth } from '../services/firebase';
	import { browser } from '$app/environment';

	let firebaseUi = undefined as undefined | any;

	onMount(async () => {
		const firebaseUi = await firebaseAuthUi();
		if (firebaseUi) {
			firebaseUi.start('#firebaseui-auth-container', {
				signInOptions: authProviders,
				signInSuccessUrl: '/admin' 
			});
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

<div id="firebaseui-auth-container"></div>

<style lang="scss">
	@import '/css/firebase-ui.css';
</style>

