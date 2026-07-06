<script lang="ts">
	import beeIcon from "$lib/assets/images/bee.svg";
	import nutIcon from "$lib/assets/images/hazelnut.svg";
	import shellIcon from "$lib/assets/images/shell.svg";

	const bee: string = beeIcon;
	const shell: string = shellIcon;
	const nut: string = nutIcon;
</script>

<a href="/" class="center logo-link">
	<div class="logo-part">
		<img src={bee} alt="" width="30" height="30" />
		<p>Bradley</p>
	</div>
	<div class="logo-part">
		<img src={shell} alt="" width="30" height="30" />
		<p>Shell</p>
	</div>
	<div class="logo-part">
		<img src={nut} alt="" width="30" height="30" />
		<p>Nut</p>
	</div>
</a>

<style lang="postcss">
	a.logo-link {
		text-transform: uppercase;
		display: grid;
		grid-template-columns: repeat(3, auto);
		justify-content: center;
		align-items: center;
		gap: 1rem;
		padding: 0;
		font-size: 2rem;
		--scale: 0;
		text-decoration: none;

		&:hover {
			--scale: 1;
		}

		& .logo-part {
			display: grid;
			justify-items: center;
			font-weight: bold;
			margin-right: 0;
			padding: 0;
			padding-right: 0.3rem;

			& p {
				position: relative;
				font-size: 1.4rem;
				margin: 0.5rem 0 0 0;

				&::after {
					content: "";
					position: absolute;
					width: 100%;
					height: 2px;
					bottom: -0.5px;
					left: 0px;
					background: var(--linkHover);
					transition: transform 0.3s ease 0s;
					transform: scale(var(--scale));
				}

				&:hover {
					--scale: 1;
				}
			}

			& img {
				width: 3rem;
			}
		}
	}
</style>
