<script lang="ts">
	import { onMount } from 'svelte';
    import { firebaseAuth } from '../services/firebase';
	import { currentUser } from '../stores/currentUser';

    onMount(() => {
    });
</script>

<div class="container">
    <header>
        <span>{ $currentUser?.displayName }</span>
        <button on:click={() => firebaseAuth.signOut()}>Sign Out</button>
    </header>
    <main>
        <slot></slot>
    </main>
</div>