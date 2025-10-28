<script lang="ts">
import ExternalLink from '$lib/components/ExternalLink.svelte';
</script>

<section id="uses-privacy-hardware-software">
	<h2>Privacy Hardware and Software</h2>

	<p>
		For the past few years I've been working towards moving my data to
		self-hosted systems and systems I trust to hold my data.
	</p>

	<p>
		If you want to see more info about this head to my <a href="/privacy"
			>Privacy</a
		> page.
	</p>

	<h3>Hardware Authentication</h3>

	<ul>
		<li>
			<ExternalLink
				linkData={{
					href: "https://www.yubico.com/product/yubikey-5c/",
					ariaLabel: "YubiKey 5C",
				}}
				textData={{ text: "YubiKey 5C", showIcon: true, location: "left" }}
			/>
		</li>
	</ul>

	<h3>NAS Servers</h3>

	<ul>
		<li>
			<ExternalLink
				linkData={{ href: "https://synology.com/", ariaLabel: "Synology NAS" }}
				textData={{ text: "Synology DS918+", showIcon: true, location: "left" }}
			/>
		</li>
	</ul>
</section>

<style lang="postcss">
  ul {
    list-style-type: square;
    padding-inline-start: 4rem;
  }
</style>