<script lang="ts">
	import { page } from "$app/state";
	import { NavigationMenu } from "bits-ui";
</script>

<nav aria-label="header navigation">
	<NavigationMenu.Root>
		<NavigationMenu.List>
			<NavigationMenu.Item value="home">
				<NavigationMenu.Link
					href="/"
					active={page.url.pathname === "/"}
					class={page.url.pathname === "/" ? "active" : ""}
					data-umami-event="Navigation"
					data-umami-event-page="Home">Home</NavigationMenu.Link
				>
			</NavigationMenu.Item>
			<NavigationMenu.Item value="about">
				<NavigationMenu.Link
					href="/about"
					active={page.url.pathname === "/about"}
					class={page.url.pathname === "/about" ? "active" : ""}
					data-umami-event="Navigation"
					data-umami-event-page="About"
				>
					About
				</NavigationMenu.Link>
			</NavigationMenu.Item>
			<NavigationMenu.Item value="portfolio">
				<NavigationMenu.Link
					href="/portfolio"
					active={page.url.pathname === "/portfolio"}
					class={page.url.pathname === "/portfolio" ? "active" : ""}
					data-umami-event="Navigation"
					data-umami-event-page="Portfolio"
				>
					Portfolio
				</NavigationMenu.Link>
			</NavigationMenu.Item>
			<NavigationMenu.Item value="uses">
				<NavigationMenu.Link
					href="/uses"
					active={page.url.pathname === "/uses"}
					class={page.url.pathname === "/uses" ? "active" : ""}
					data-umami-event="Navigation"
					data-umami-event-page="Uses"
				>
					Uses
				</NavigationMenu.Link>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
</nav>

<style lang="postcss">
	nav {
		display: grid;
		grid-template-columns: repeat(4, auto);
		justify-content: right;
		align-content: center;

		@media (max-width: 650px) {
			justify-content: center;
		}

		margin: 0.5rem;
		padding: 2rem;

		& :global(ul) {
			list-style: none;
			display: grid;
			grid-template-columns: repeat(4, auto);
			gap: 0 25px;
		}

		& :global(li) {
			display: contents;
		}

		& :global(a[data-navigation-menu-link]) {
			position: relative;
			font-size: 2rem;
			text-decoration: none;

			&::after {
				content: '';
				position: absolute;
				width: 100%;
				height: 2px;
				bottom: -5px;
				left: 0;
				background: var(--linkHover);
				transition: transform 0.3s ease;
				transform: scale(0);
			}

			&:global(.active)::after,
			&:hover::after {
				transform: scale(1);
			}
		}
	}
</style>
