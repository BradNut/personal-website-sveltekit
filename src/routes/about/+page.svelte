<script lang="ts">
	import Img from '@zerodevx/svelte-img';
	import Graphql from '@iconify-icons/simple-icons/graphql';
	import Nextdotjs from '@iconify-icons/simple-icons/next-dot-js';
	import Prisma from '@iconify-icons/simple-icons/prisma';
	import Gatsby from '@iconify-icons/simple-icons/gatsby';
	import Docker from '@iconify-icons/simple-icons/docker';
	import React from '@iconify-icons/simple-icons/react';
	import Remix from '@iconify-icons/simple-icons/remix';
	import Svelte from '@iconify-icons/simple-icons/svelte';
	import TypeScript from '@iconify-icons/simple-icons/typescript';
	import SEO from "$lib/components/SEO.svelte";
	import space_needle from '$lib/assets/images/space-needle.png?run';
	import tortie_derp from '$lib/assets/images/tortie_derp.jpg?run';
	import orange_derp from '$lib/assets/images/orange_derp.jpg?run';
	import turnip from '$lib/assets/images/turnip.svg';
	import Tag from '$root/lib/components/Tag.svelte';
	import ExternalLink from '$root/lib/components/ExternalLink.svelte';
</script>

<SEO title="About" />

<div class="about">
	<div>
		<h1>About</h1>
		<p>Hey! My name is Bradley Shellnut.</p>
		<p>
			I'm {new Date().getFullYear() - 1991} years old and I am a full stack
			software engineer who's interested in new tech and not afraid to
			discover new interests.
		</p>
	</div>
	<div>
		<h2>More deets</h2>
		<p>
			I graduated from Cal Poly San Luis Obispo in 2013 with a Bachelor's
			degree in Computer Engineering.{' '}
			<span class="emoji" title="Software + Hardware">
				💻
			</span>
		</p>
		<p>
			At work I develop in Java Spring, Spring Boot, PostgreSQL, and React /
			Angular.
		</p>
		<p>
			At home I delve into other frameworks, languages, and platforms such
			as:
		</p>
		<div
			class="tech-list"
		>
			<a
				target="_blank"
				aria-label="React"
				href="https://reactjs.org/"
				class="center"
				rel="noreferrer"
			>
				<iconify-icon icon={React} width="24" height="24" role="img" title="React" />
				<p>React</p>
			</a>
			<a
				target="_blank"
				aria-label="TypeScript"
				href="https://typescriptlang.org/"
				class="center"
				rel="noreferrer"
			>
				<iconify-icon icon={TypeScript} width="24" height="24" role="img" title="TypeScript" />
				<p>TypeScript</p>
			</a>
			<a
				target="_blank"
				aria-label="Svelte"
				href="https://svelte.dev"
				class="center"
				rel="noreferrer"
			>
				<iconify-icon icon={Svelte} width="24" height="24" role="img" title="Svelte" />
				<p>Svelte</p>
			</a>
			<a
				target="_blank"
				aria-label="NextJS"
				href="https://nextjs.org/"
				class="center"
				rel="noreferrer"
			>
				<iconify-icon icon={Nextdotjs} width="24" height="24" role="img" title="NextJS" />
				<p>NextJS</p>
			</a>
			<a
				target="_blank"
				aria-label="Remix"
				href="https://remix.run/"
				class="center"
				rel="noreferrer"
			>
				<iconify-icon icon={Remix} width="24" height="24" role="img" title="Remix" />
				<p>Remix</p>
			</a>
			<a
				target="_blank"
				aria-label="GraphQL"
				href="https://graphql.org/"
				class="center"
				rel="noreferrer"
			>
				<iconify-icon icon={Graphql} width="24" height="24" role="img" title="GraphQL" />
				<p>GraphQL</p>
			</a>
			<a
				target="_blank"
				aria-label="Prisma"
				href="https://prisma.io/"
				class="center"
				rel="noreferrer"
			>
				<iconify-icon icon={Prisma} width="24" height="24" role="img" title="Prisma" />
				<p>Prisma</p>
			</a>
			<a
				target="_blank"
				aria-label="GatsbyJS"
				href="https://gatsbyjs.com/"
				class="center"
				rel="noreferrer"
			>
				<iconify-icon icon={Gatsby} width="24" height="24" role="img" title="Gatsby" />
				<p>Gatsby</p>
			</a>
			<a
				target="_blank"
				aria-label="Docker"
				href="https://docker.com/"
				class="center"
				rel="noreferrer"
			>
				<iconify-icon icon={Docker} width="24" height="24" role="img" title="Docker" />
				<p>Docker</p>
			</a>
		</div>
	</div>
	<div>
		<h2>Extracurricular</h2>
		<p>
			Outside of work I like to take tutorials from many instructors like
			those below:
		</p>
		<div class="extracurricular">
			<div class="card">
				<h3>
					<ExternalLink
						ariaLabel="Wes Bos Courses"
						href="https://wesbos.com/courses"
						showIcon
					>
						Wes Bos
					</ExternalLink>
				</h3>
				<div class="tags">
					<Tag name="React" />
					<Tag name="GraphQL" />
					<Tag name="Gatsby" />
					<Tag name="JavaScript" />
				</div>
			</div>
			<div class="card">
				<h3>
					<ExternalLink
						ariaLabel="Scott Tolinski"
						href="https://www.scotttolinski.com"
						showIcon
					>
						Scott Tolinski
					</ExternalLink>
					<ExternalLink
						ariaLabel="Levelup Tutorials"
						href="https://levelup.video"
						showIcon
					>
						Level Up Tutorials
					</ExternalLink>
				</h3>
				<div class="tags">
					<Tag name="React" />
					<Tag name="TypeScript" />
					<Tag name="Svelte Kit" />
					<Tag name="Remix" />
					<Tag name="Figma" />
					<Tag name="Design Systems" />
				</div>
			</div>
			<div class="card">
				<h3>
					<ExternalLink
						ariaLabel="Amy Kapernick"
						href="https://www.amyskapers.dev/"
						showIcon
					>
						Amy Kapernick
					</ExternalLink>
					<ExternalLink
						ariaLabel="Levelup Tutorials"
						href="https://levelup.video"
						showIcon
					>
						Level Up Tutorials
					</ExternalLink>
				</h3>
				<div class="tags">
					<Tag name="Accessibility for Everyone" />
				</div>
			</div>
			<div class="card">
				<h3>
					<ExternalLink
						ariaLabel="Andrew Mead on Udemy"
						href="https://www.udemy.com/user/andrewmead/"
						showIcon
					>
						Andrew Mead
					</ExternalLink>
				</h3>
				<div class="tags">
					<Tag name="GraphQL" />
					<Tag name="Apollo" />
					<Tag name="Prisma" />
				</div>
			</div>
			<div class="card">
				<h3>
					<ExternalLink
						ariaLabel="Steven Grider on Udemy"
						href="https://www.udemy.com/user/sgslo/"
						showIcon
					>
						Steven Grider
					</ExternalLink>
				</h3>
				<div class="tags">
					<Tag name="React" />
					<Tag name="Redux" />
					<Tag name="Docker" />
					<Tag name="GraphQL" />
					<Tag name="CSS" />
					<Tag name="HTML" />
					<Tag name="JavaScript" />
				</div>
			</div>
		</div>
	</div>
	<div>
		<h2>Other fun things about me&hellip;</h2>
		<div style="display: grid;">
			<p>
				Currently living in Seattle after a long road trip!
			</p>
			<div
				style="
					display: grid;
					grid-template-columns: minmax(200px, 400px);
					align-items: center;
					justify-content: center;
				"
			>
				<Img class="portfolio-image better-blur" src={space_needle} alt="Clip art of the Seattle space needle" />
				<p class="center">Seattle Space Needle</p>
			</div>
		</div>
		<div>
			<p>Bringing these two cats, Turnip and Taco, along for the ride.</p>
			<div class="cat-pics">
				<figure>
					<Img class="portfolio-image better-blur" src={tortie_derp} alt="Turnip Cat" />
					<p class="center">Turnip <img class="icon" src={turnip} width="25px" height="25px" alt="Turnip" /></p>
				</figure>
				<figure>
					<Img class="portfolio-image better-blur" src={orange_derp} alt="Taco Cat" />
					<p class="center">Taco 🌮</p>
				</figure>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	:global(img) {
		height: auto;
		max-width: 100%;
	}

	.icon {
		display: inline-block;
		vertical-align: top;
	}

	.about {
		display: grid;
		grid-gap: 2.5rem;

		p {
			margin: 1rem;
			/* padding: 0.2rem; */
		}
	}

	.tech-list {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		place-content: center;
		gap: 1rem;
		margin-top: 1rem;
		font-size: 2rem;

		a {
			display: grid;
			justify-items: center;

			font-weight: bold;
			margin-right: 0;
			padding: 0;
			text-decoration: none;
			padding: 0.3rem;
			margin-left: 1rem;
			color: var(--lightGrey);

			p {
				font-size: 1.5rem;
				padding-top: 0.3rem;
				margin: 0;
			}

			&:hover {
				color: var(--shellYellow);
				p {
					color: var(--shellYellow);
				}
			}
		}
	}

	.extracurricular {
		display: grid;
		grid-template-columns: repeat(3, auto);
		/* justify-content: center; */
		/* align-items: center; */
		gap: 1.5rem;

		@media (max-width: 1000px) {
			grid-template-columns: repeat(2, auto);
			--cardHeightMin: 20rem;
		}

		@media (max-width: 700px) {
			--cardHeightMin: 10rem;
			grid-template-columns: 1fr;
		}
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		justify-content: left;
		align-items: center;
	}

	.cat-pics {
		display: grid;
		grid-template-columns: repeat(2, minmax(200px, 0.3fr));
		align-items: center;
		justify-content: center;
		gap: 2rem;
	}
</style>