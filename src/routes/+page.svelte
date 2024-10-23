<script lang="ts">
	import { onMount } from 'svelte';
	import { authProviders, firebaseAuth } from '../services/firebase';
	import { browser } from '$app/environment';

	onMount(async () => {
		const firebaseUi = await firebaseAuthUi();
		if (firebaseUi) {
			firebaseUi.start('#firebaseui-auth-container', {
				signInOptions: authProviders
			});
		}
	});

	async function firebaseAuthUi() {
		if (browser) {
            const firebaseui = await import("firebaseui");
			return new firebaseui.auth.AuthUI(firebaseAuth);
		}
		return undefined;
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<div id="firebaseui-auth-container"></div>
This is sad.