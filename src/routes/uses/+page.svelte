<script lang="ts">
	import ExternalLink from '$lib/components/ExternalLink.svelte';
	import LazyImage from '$lib/components/LazyImage.svelte';
	import desktop from '$lib/assets/images/Desktop_so_clean.jpg?as=run';
	// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
	import HardwareAccessories from '$lib/content/uses/hardware-accessories.md';
	// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
	import Development from '$lib/content/uses/development.md';
	// @ts-expect-error: Cannot find module '$lib/content/uses/development.md' or its corresponding type declarations.ts(2307)
	import PrivacyHardwareSoftware from '$lib/content/uses/privacy-hardware-software.md';
</script>

<div class="uses">
	<div>
		<h1>/Uses</h1>
		<p>
			Inspired by <ExternalLink ariaLabel="Wes Bos' Website" href="https://wesbox.com" showIcon>Wes Bos'</ExternalLink> <ExternalLink ariaLabel="Wes Bos' Uses Page" href="https://wesbos.com/uses" showIcon>/uses</ExternalLink> page and <ExternalLink ariaLabel="Uses list website" href="https://uses.tech/" showIcon>Uses.tech</ExternalLink>, this is a list of what I use everyday for my work and personal life.
		</p>
	</div>
	<div class="uses-image">
		<LazyImage clazz="uses-image" src={desktop} alt="Clean desk with Samsung monitor and Ducky Keyboard" loading="eager" />
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

	p {
		margin: 1rem;
	}

	:global(.uses-image) {
		margin-left: auto;
		margin-right: auto;
		aspect-ratio: 4 / 3;
		max-height: 480px;

		@media(max-width: 800px) {
			max-height: 350px;
		}

		@media(max-width: 500px) {
			max-height: 300px;
		}
	}
</style>