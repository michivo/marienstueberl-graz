<script lang="ts">
	import { onMount } from 'svelte';
	import { currentUser } from '../stores/currentUser';
	import LoggedInHeader from '../components/headers/LoggedInHeader.svelte';
	import EmptyHeader from '../components/headers/EmptyHeader.svelte';
	import LoadingHeader from '../components/headers/LoadingHeader.svelte';

    onMount(() => {
    });
</script>

<div class="container">
    {#if $currentUser}
        <LoggedInHeader />
    {:else if $currentUser === null}
         <EmptyHeader />
    {:else}
        <LoadingHeader />
    {/if}
    <main>
        <slot></slot>
    </main>
</div>