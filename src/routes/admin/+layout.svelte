<script lang="ts">
	import { getIdTokenResult } from 'firebase/auth';
	import Spinner from '../../components/misc/Spinner.svelte';
	import { currentUser } from '../../stores/currentUser';
	import { onMount } from 'svelte';
	import { logOut } from '../../services/firebase';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	let { children } = $props();

	onMount(async () => {
		if ($currentUser.user) {
			const idToken = await getIdTokenResult($currentUser.user);
			if (!idToken.claims['admin']) {
				console.error('Not an admin');
				await logOut();
				await goto('/');
			}
		} else {
			goto('/');
		}
	});
</script>

{#if $currentUser.state === 'loggedIn'}
	<div class="main-container">
		<nav>
			<ul>
				<li class:active={$page.url.pathname === '/admin/clients'}>
					<a href="/admin/clients"><span>Klient:innen</span></a>
				</li>
				<li class:active={$page.url.pathname === '/admin/config'}>
                    <a href="/admin/config"><span>Einstellungen</span></a>
                </li>
				<li class:active={$page.url.pathname === '/admin/users'}>
                    <a href="/admin/users"><span>Benutzer:innen</span></a>
                </li>
			</ul>
		</nav>
		<main>
			{@render children()}
		</main>
	</div>
{:else if $currentUser.state === 'pending'}
	<Spinner />
{:else}
	<div>Sie haben keine Berechtigung, auf diese Seite zuzugreifen.</div>
{/if}

<style lang="scss">
    .main-container {
        display: flex;
        width: 75%;
        min-width: 1200px;
        flex: 1;
    }

    nav {
        border-right: 1px solid black;

        ul {
            list-style-type: none;
            display: flex;
            flex-direction: column;
            margin: 0;
            padding: 0;
            align-items: stretch;

            li {
                font-size: 1.25rem;
                border-top: 1px solid #555;

                &:first-child {
                    border-top: none;
                }

                a {
                    color: black;
                    text-decoration: none;
                    width: 100%;
                    height: 100%;
                    display: inline-block;
                    padding: 1rem 0;
                    font-weight: 300;

                    a:hover {
                        color: var(--light);
                    }

                    span {
                        padding: 0 2rem;
                    }
                }

                a:hover {
                    background-color: var(--secondary-dark);
                    color: var(--light);
                }

                &.active {
                    a {
                        background-color: var(--highlight-red);
                        color: var(--light);
                    }
                }
            }
        }
    }

    main {
        padding: 1rem;
    }
</style>