<script lang="ts">
	import { currentUser } from '../stores/currentUser';
	import LoggedInHeader from '../components/headers/LoggedInHeader.svelte';
	import EmptyHeader from '../components/headers/EmptyHeader.svelte';
	import LoadingHeader from '../components/headers/LoadingHeader.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
</script>

<div class="container">
	{#if $currentUser.state === 'loggedIn'}
		<LoggedInHeader />
	{:else if $currentUser.state === 'loggedOut'}
		<EmptyHeader />
	{:else}
		<LoadingHeader />
	{/if}
	<slot></slot>
	<footer>
		<a href="/imprint">Impressum</a>
	</footer>
</div>

<style>
	.container {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}

	footer {
		border-top: 1px solid #ccc;
		display: flex;
		justify-content: center;
		padding: 0.25rem;

		a {
			text-transform: uppercase;
			color: var(--dark);
		}
	}
</style>
