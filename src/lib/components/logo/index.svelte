<script lang="ts">
	import beeIcon from '$lib/assets/images/bee.svg';
	import shellIcon from '$lib/assets/images/shell.svg';
	import nutIcon from '$lib/assets/images/hazelnut.svg';
</script>

<div>
	<a href="/" class="center">
		<img src={beeIcon} alt="Bee Icon" width="30" height="30"/>
		<p>Bradley</p>
	</a>
	<a href="/" class="center">
		<img src={shellIcon} alt="Shell Icon" width="30" height="30"/>
		<p>Shell</p>
	</a>
	<a href="/" class="center">
		<img src={nutIcon} alt="Nut Icon" width="30" height="30"/>
		<p>Nut</p>
	</a>
</div>

<style lang="postcss">
	div {
		text-transform: uppercase;
		display: grid;
		grid-template-columns: repeat(3, auto);
		justify-content: center;
		align-items: center;
		grid-gap: 1rem;
		padding: 0rem;
		font-size: 2rem;
		--scale: 0;

		& p::after {
			content: '';
			position: absolute;
			width: 100%;
			height: 2px;
			bottom: -0.5px;
			left: 0px;
			background: var(--linkHover);
			transition: transform 0.3s ease 0s;
			transform: scale(var(--scale));
		}

		& a {
			display: grid;
			justify-items: center;
			text-decoration: none;

			font-weight: bold;
			margin-right: 0;
			padding: 0;
			padding-right: 0.3rem;

			&:hover {
				--scale: 1;
			}

			& p {
				position: relative;
				font-size: 0.5em;
				/* padding-top: 0.3rem; */
				margin: 0.5rem 0 0 0;
				&:hover {
					--scale: 1;
				}
				&:after {
					transform: scale(var(--scale));
				}
			}

			& img {
				width: 3rem;
			}
		}
	}
</style>