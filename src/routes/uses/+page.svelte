<script lang="ts">
	import Img from '@zerodevx/svelte-img';
	import SEO from "$lib/components/SEO.svelte";
	import desktop from '$lib/assets/images/Desktop_so_clean.jpg?run';
	import HardwareAccessories from '$lib/content/uses/hardware-accessories.md';
	import Development from '$lib/content/uses/development.md';
	import PrivacyHardwareSoftware from '$lib/content/uses/privacy-hardware-software.md';
	import ExternalLink from '$root/lib/components/ExternalLink.svelte';
</script>

<SEO title="Uses" />

<div class="uses">
	<div>
		<h1>/Uses</h1>
		<p>
			Inspired by <ExternalLink ariaLabel="Wes Bos' Website" href="https://wesbox.com" showIcon>Wes Bos'</ExternalLink> <ExternalLink ariaLabel="Wes Bos' Uses Page" href="https://wesbos.com/uses" showIcon>/uses</ExternalLink> page and <ExternalLink ariaLabel="Uses list website" href="https://uses.tech/" showIcon>Uses.tech</ExternalLink>, this is a list of what I use everyday for my work and personal life.
		</p>
	</div>
	<div class="uses-image">
		<Img class="uses-image better-blur" src={desktop} alt="Clean desk with Samsung monitor and Ducky Keyboard" loading="eager" />
	</div>
	<HardwareAccessories />
	<Development />
	<PrivacyHardwareSoftware />
</div>

<style lang="postcss">
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
	}
</style>