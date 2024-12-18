<script lang="ts">
	import ExternalLink from "$lib/components/ExternalLink.svelte";
	import desktop from "$lib/assets/images/Desktop_so_clean.jpg?enhanced";
	import Development from "./development.svelte";
	import PrivacyHardwareSoftware from './privacy-hardware-software.svelte';
	import HardwareAccessories from "./hardware-accessories.svelte";
</script>

<div class="uses">
	<div>
		<h1>/Uses</h1>
		<p>
			Inspired by <ExternalLink
				linkData={{ href: "https://wesbos.com", ariaLabel: "Wes Bos' Website" }}
				textData={{ text: "Wes Bos", showIcon: true, location: "left" }}
			/>
			<ExternalLink
				linkData={{
					href: "https://wesbos.com/uses",
					ariaLabel: "Wes Bos' Uses Page",
				}}
				textData={{ text: "/uses", showIcon: true, location: "left" }}
			/> page and <ExternalLink
				linkData={{ href: "https://uses.tech/", ariaLabel: "Uses.tech" }}
				textData={{ text: "Uses.tech", showIcon: true, location: "left" }}
			/>, this is a list of what I use everyday for my work and personal life.
		</p>
	</div>
	<div class="uses-image">
		<enhanced:img
			src={desktop}
			alt="Clean desk with Samsung monitor and Ducky Keyboard"
			fetchpriority="high"
			loading="eager"
			sizes="(max-height: 480px) 480px, 500px"
		/>
	</div>
	<div>
		<HardwareAccessories />
		<Development />
		<PrivacyHardwareSoftware />
	</div>
</div>

<style lang="postcss">
	.uses {
		display: grid;
		gap: 2rem;
	}

	.uses-image img {
		max-width: 640px;
		height: auto;
		margin-left: auto;
		margin-right: auto;
	}

	p {
		margin: 1rem;
	}

	/* :global(.uses-image) {
		margin-left: auto;
		margin-right: auto;
		aspect-ratio: 4 / 3;
		max-height: 480px;

		@media (max-width: 800px) {
			max-height: 350px;
		}

		@media (max-width: 500px) {
			max-height: 300px;
		}
	} */
</style>
