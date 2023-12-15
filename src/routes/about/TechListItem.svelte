<script lang="ts">
	import type { IconifyIcon } from "iconify-icon/dist/iconify-icon.js";

	export let ariaLabel: string;
	export let href: string;
	export let clazz = "";
	export let itemText: string;
	export let icon: IconifyIcon;
</script>

<a
	target="_blank"
	rel="noreferrer"
	aria-label={ariaLabel}
	{href}
	class={clazz}
>
	<iconify-icon {icon} width="24" height="24" role="img" title={itemText} />
	<p>{itemText}</p>
</a>

<style lang="postcss">
	a {
		display: grid;
		justify-items: center;

		font-weight: bold;
		margin-right: 0;
		text-decoration: none;
		padding: 0.3rem;
		margin-left: 1rem;
		color: var(--lightGrey);

		& p {
			font-size: 1.5rem;
			padding-top: 0.3rem;
			margin: 0;
		}

		&:hover {
			color: var(--shellYellow);
			& p {
				color: var(--shellYellow);
			}
		}
	}
</style>
