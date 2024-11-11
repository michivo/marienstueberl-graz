<script>
	import { onMount } from 'svelte';
	import { firebaseAuth, logOut } from '../../services/firebase';
	import { currentUser } from '../../stores/currentUser';
	import { getIdTokenResult } from 'firebase/auth';
	import Spinner from '../../components/misc/Spinner.svelte';
	import { goto } from '$app/navigation';

	onMount(async () => {
		if($currentUser.user) {
			const idToken = await getIdTokenResult($currentUser.user);
			if(!idToken.claims['admin']) {
				console.error('Not an admin');
				await logOut();
				await goto('/');
			}
		}
		else {
			goto('/');
		}
	});

	async function makeMeAdmin() {
		console.error($currentUser);
		const token = await firebaseAuth.currentUser?.getIdToken(false);
		// const token = await $currentUser?.getIdToken(false);
		await fetch('https://setisadmin-joqt3ovt4q-ew.a.run.app', {
			headers: {
				Authorization: 'Bearer ' + token
			}
		});
	}
</script>

{#if $currentUser.state === 'loggedIn'}
<h1>Hello {$currentUser.user?.displayName}!</h1>
<button on:click={makeMeAdmin}>Magic Button</button>
{:else if $currentUser.state === 'pending'}
	 <Spinner />
{:else}
	 <div>Sie haben keine Berechtigung, auf diese Seite zuzugreifen.</div>
{/if}