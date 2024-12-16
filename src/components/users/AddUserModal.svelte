<script lang="ts">
	import type { UserAccount } from '../../types/userAccount';

	let {
		user,
		users,
		saveUser,
		closeUserModal
	}: { user: UserAccount; users: UserAccount[]; saveUser: (c: UserAccount) => void; closeUserModal: () => void } =
		$props();

    let isUserReady = $derived.by(() => {
        if(user.uid === '') {
            return false;
        }
        if(!(user.customClaims?.admin || user.customClaims?.privilegedUser)) {
            return false;
        }
        return true;
    });

    let availableUsers = $derived(users.filter(u => u.displayName && u.email));

	function doSaveClient() {
		const copy = { ...user };
		saveUser(copy);
	}

    function onChangeRole(role: 'admin' | 'privilegedUser') {
        user.customClaims = {
            admin: role === 'admin',
            privilegedUser: role === 'privilegedUser',
        };
    }

    function onEmailSelected() {
        const selectedUser = users.find(u => u.email === user.email && !!u.displayName);
        if(selectedUser) {
            user = selectedUser;
            setDefaultRole();
        }
        else {
            user.uid = '';
        }
    }

    function setDefaultRole() {
        if(!user.customClaims || (!user.customClaims.admin && !user.customClaims.privilegedUser)) {
            user.customClaims = {
                admin: false,
                privilegedUser: true
            };
        }
    }

    function onNameSelected() {
        const selectedUser = users.find(u => u.displayName === user.displayName && !!u.email);
        if(selectedUser) {
            user = selectedUser;
            setDefaultRole();
        }
        else {
            user.uid = '';
        }
    }
</script>

<form method="dialog">
	<label for="name-select">Name</label>
    <select bind:value={user.displayName} onchange={onNameSelected} id="name-select">
        {#each availableUsers as user}
            <option value={user.displayName}>{user.displayName}</option>
        {/each}
    </select>
	<label for="email-select">E-Mail</label>
    <select bind:value={user.email} onchange={onEmailSelected} id="email-select">
        {#each availableUsers as user}
            <option value={user.email}>{user.email}</option>
        {/each}
    </select>
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

        <div class="user-info">
            Bevor Sie eine:n Benutzer:in als Admin oder Helfer:in hinzufügen können, muss sich die jeweilige Person einmal angemeldet haben (wird sich in Zukunft ändern).
        </div>
	<button type="submit" onclick={doSaveClient} disabled={!isUserReady}>Speichern</button>
	<button onclick={closeUserModal}>Abbrechen</button>
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

    select {
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 0.25rem;
        padding: 0.25rem;
        min-height: 1.8rem;
        font-size: 1rem;

        option {
            font-weight: 400;
        }
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
