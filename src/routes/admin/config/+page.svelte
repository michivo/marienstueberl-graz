<script lang="ts">
	import { onMount } from 'svelte';
	import {
		WEEKDAY,
		type DistributionConfig,
		type WeekDay
	} from '../../../types/distributionConfig';
	import { getConfig, updateConfig } from '../../../services/distributionConfig';

	let config = $state(undefined as undefined | DistributionConfig);
	let totalSlots = $derived.by(() => {
		if (!config) return 0;
        const totalHours = WEEKDAY.reduce((acc, day) => {
            if (!config || !config[day].enabled) {
                return acc;
            }
            const startHours = getHours(config[day].startTime);
            const endHours = getHours(config[day].endTime);
            return acc + (endHours - startHours);
        }, 0);
		return (config.peoplePerSlot * config.timeSlotsPerHour) * totalHours;
	});

	onMount(async () => {
		config = await getConfig();
	});

	function isEnabled(day: WeekDay) {
		if (!config) return false;
		const configDay = config[day];
		return configDay.enabled;
	}

    function getHours(timeString: string) {
        const [hours, minutes] = timeString.split(':');
        return parseInt(hours) + parseInt(minutes) / 60;
    }

	function getDayLabel(day: WeekDay) {
		switch (day) {
			case 'monday':
				return 'Montag';
			case 'tuesday':
				return 'Dienstag';
			case 'wednesday':
				return 'Mittwoch';
			case 'thursday':
				return 'Donnerstag';
			case 'friday':
				return 'Freitag';
			case 'saturday':
				return 'Samstag';
			case 'sunday':
				return 'Sonntag';
		}
	}

    async function saveConfig() {
        if(!config) {
            return;
        }
        await updateConfig(config);
    }
</script>

<div>
	<h2>Einstellungen</h2>
	{#if config}
		<form on:submit|preventDefault={() => saveConfig()}>
			<h3>Wochentage mit Ausgabe</h3>
			<div class="weekdays">
				{#each WEEKDAY as day}
					<label class="day-label"
						><input type="checkbox" name="monday" bind:checked={config[day].enabled} />{getDayLabel(
							day
						)}</label
					>
					<label class="time-label"
						>Von: <input
							type="text"
							placeholder="00:00"
							bind:value={config[day].startTime}
							disabled={!isEnabled(day)}
						/></label
					>
					<label class="time-label"
						>Bis: <input
							type="text"
							placeholder="00:00"
							bind:value={config[day].endTime}
							disabled={!isEnabled(day)}
						/></label
					>
				{/each}
			</div>
			<div class="slot-config">
				<label class="slot-config-item"
					><span>Anzahl der Zeitslots pro Stunde:</span><input
						type="number"
						min="1"
						max="12"
						bind:value={config.timeSlotsPerHour}
					/></label
				>
				<label class="slot-config-item"
					><span>Anzahl der Familien pro Zeitslot:</span><input
						type="number"
						min="1"
						max="10"
						bind:value={config.peoplePerSlot}
					/></label
				>
				<span class="slot-summary">Insgesamt können Lebensmittel an <span class="slot-count">{totalSlots} Personen</span> ausgegeben werden.</span>
			</div>
            <button type="submit">Speichern</button>
		</form>
	{/if}
</div>

<style scoped>
	.weekdays {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
	label {
		display: flex;
		align-items: center;

		&.time-label {
			input {
				margin-left: 1rem;
			}
		}

        input {
            margin-right: 0.5rem;
        }
	}

    .slot-config {
        margin-top: 2rem;
    }
	label.slot-config-item {
		margin-top: 1rem;
        display: flex;

        span {
            width: 20rem;
            font-weight: 600;
        }
		input {
			margin-left: 0.5rem;
		}
	}

    .slot-summary {
        display: block;
        margin-top: 2rem;
        font-size: 1.1rem;

        .slot-count {
            font-weight: 600;
        }
    }
</style>
