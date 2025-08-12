<script lang="ts">
	import { onNavigate, beforeNavigate } from "$app/navigation";

	let visible = $state(false);
	let progress = $state(0);
	let load_durations = $state<number[]>([]);
	let average_load = $derived(
		load_durations.reduce((a, b) => a + b, 0) / load_durations.length,
	);

	const increment = 1;
	let interval: number | null = null;

	beforeNavigate(() => {
		// Start the progress bar immediately when navigation begins
		visible = true;
		progress = 0;
		
		// Clear any existing interval
		if (interval) {
			clearInterval(interval);
		}
		
		const typical_load_time = average_load || 200; // ms
		const frequency = typical_load_time / 100;
		
		interval = setInterval(() => {
			// Increment the progress bar but cap at 20% during beforeNavigate
			if (progress < 20) {
				progress += increment;
			}
		}, frequency);
	});

	onNavigate((navigation) => {
		console.log("Navigating to", navigation?.to);
		let start = performance.now();
		
		// Resolve the promise when the page is done loading
		navigation?.complete.then(() => {
			progress = 100; // Fill out the progress bar
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
			// after 100 ms hide the progress bar
			setTimeout(() => {
				visible = false;
			}, 500);
			// Log how long that one took
			const end = performance.now();
			const duration = end - start;
			load_durations = [...load_durations, duration];
		});
	});
</script>

{#if visible}
	<div class="progress" style="width: {progress}%;"></div>
{/if}

<style lang="postcss">
	.progress {
		background: var(--lightGrey);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 0.25rem;
		z-index: 50;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
