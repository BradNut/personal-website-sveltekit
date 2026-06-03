<script lang="ts">
	import ExternalLink from "$lib/components/ExternalLink.svelte";
</script>

<section>
	<h2>Hardware & Accessories</h2>
	<ul>
		<li>MacBook Pro 15-inch for work.</li>
		<li>
			Personal desktop running <ExternalLink
				linkData={{
					href: "https://pop.system76.com/",
					ariaLabel: "PopOS Linux Distro",
				}}
				textData={{ text: "PopOS", showIcon: true, location: "left" }}
			/>.
		</li>
		<li>Dell XPS 13 running PopOS.</li>
		<li>
			Phone 📱: Pixel 10 running <ExternalLink
				linkData={{
					href: "https://grapheneos.org/",
					ariaLabel: "GrapheneOS",
				}}
				textData={{ text: "GrapheneOS", showIcon: true, location: "left" }}
			/>.
		</li>
		<li>
			Keyboard ⌨️: <ExternalLink
				linkData={{
					href: "https://trulyergonomic.com/",
					ariaLabel: "Truly Ergonomic Keyboard",
				}}
				textData={{
					text: "Truly Ergonomic Keyboard",
					showIcon: true,
					location: "left",
				}}
			/>
		</li>
		<li>
			Mouse 🖱️: <ExternalLink
				linkData={{
					href: "https://www.logitech.com/en-us/shop/p/mx-ergo-wireless-trackball-mouse",
					ariaLabel: "Logitech MX ERGO",
				}}
				textData={{
					text: "Logitech MX ERGO",
					showIcon: true,
					location: "left",
				}}
			/>
		</li>
		<li>
			Chair 🪑: <ExternalLink
				linkData={{
					href: "https://secretlabus.myshopify.com/collections/omega-series#omega_2020-stealth",
					ariaLabel: "Secretlab Omega 2020 Fabric",
				}}
				textData={{
					text: "Secretlab Omega 2020 Fabric",
					showIcon: true,
					location: "left",
				}}
			/>
		</li>
		<li>
			Monitor 🖥️: <ExternalLink
				linkData={{
					href: "https://www.samsung.com/us/computing/monitors/gaming/32--odyssey-g7-gaming-monitor-lc32g75tqsnxza/",
					ariaLabel: "Samsung Odyssey G7 Gaming Monitor",
				}}
				textData={{
					text: "Samsung Odyssey G7 Gaming Monitor",
					showIcon: true,
					location: "left",
				}}
			/>
		</li>
	</ul>
</section>

<style lang="postcss">
	ul {
		padding-inline-start: 4rem;
	}
</style>
