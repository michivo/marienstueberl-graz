<script lang="ts">
	import type { UserAccount } from '../../types/userAccount';

	let {
		user,
		saveUser,
		closeModal
	}: { user: UserAccount; saveUser: (c: UserAccount) => void; closeModal: () => void } =
		$props();

    let isUserReady = $derived.by(() => {
        if(!(user.customClaims?.admin || user.customClaims?.privilegedUser) || !user.displayName || !user.email) {
            return false;
        }
        return true;
    });

	function onSaveUser() {
		const copy = { ...user };
		saveUser(copy);
	}

    function onChangeRole(role: 'admin' | 'privilegedUser') {
        user.customClaims = {
            admin: role === 'admin',
            privilegedUser: role === 'privilegedUser',
        };
    }
</script>

<form method="dialog">
	<label for="name-select">Name</label>
    <input type="text" bind:value={user.displayName} id="name-select">
	<label for="email-select">E-Mail</label>
    <input type="text" bind:value={user.email} id="email-select">
    <fieldset>
        <legend>Rolle</legend>
      
        <div>
          <input type="radio" id="admin" name="role" value="admin" checked={user.customClaims?.admin} onchange={() => onChangeRole('admin')} />
          <label for="admin">Admin</label>
        </div>
      
        <div>
          <input type="radio" id="helper" name="role" value="privilegedUser" checked={user.customClaims?.privilegedUser} onchange={() => onChangeRole('privilegedUser')}/>
          <label for="helper">Helfer:in</label>
        </div>
      </fieldset>
	<button type="submit" onclick={onSaveUser} disabled={!isUserReady}>Speichern</button>
	<button onclick={closeModal}>Abbrechen</button>
</form>

<style>
	form {
		display: grid;
	}

	label {
		font-weight: bold;
		margin-top: 1rem;
	}

	input {
		padding: 0.5rem;
		border-radius: 0.2rem;
		border: 1px solid #ccc;
	}

	button {
		margin-top: 1rem;
	}

    fieldset {
        border: 1px solid #ccc;
        border-radius: 0.2rem;
        padding: 0.5rem;
        margin-top: 1rem;

        div:last-child {
            margin-top: 0.5rem;
        }
    }

    div.user-info {
        font-size: 0.9rem;
        font-weight: 300;
        padding: 1rem;
    }
</style>
