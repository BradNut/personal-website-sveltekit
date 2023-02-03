<script lang="ts">
	import { Image, Picture } from 'svelte-lazy-loader';
	import Graphql from '@iconify-icons/simple-icons/graphql';
	import Nextdotjs from '@iconify-icons/simple-icons/next-dot-js';
	import Prisma from '@iconify-icons/simple-icons/prisma';
	import Gatsby from '@iconify-icons/simple-icons/gatsby';
	import Docker from '@iconify-icons/simple-icons/docker';
	import React from '@iconify-icons/simple-icons/react';
	import Remix from '@iconify-icons/simple-icons/remix';
	import Svelte from '@iconify-icons/simple-icons/svelte';
	import TypeScript from '@iconify-icons/simple-icons/typescript';
	import SEO from "$root/lib/components/SEO.svelte";
	import space_needle from '$lib/assets/images/space-needle.png?format=webp;avif;png&metadata';
	import space_needle_blurred from '$lib/assets/images/space-needle.png?w=100&png&blur=10';
	import tortie_derp from '$lib/assets/images/tortie_derp.jpg?format=webp;avif;jpg&metadata';
	import tortie_derp_blurred from '$lib/assets/images/tortie_derp.jpg?w=100&jpg&blur=10';
	import orange_derp from '$lib/assets/images/orange_derp.jpg?format=webp;avif;jpg&metadata';
	import orange_derp_blurred from '$lib/assets/images/orange_derp.jpg?w=100&jpg&blur=10';
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
					<a
						target="_blank"
						aria-label="Wes Bos Courses"
						href="https://wesbos.com/courses"
						rel="noreferrer"
					>
						Wes Bos
					</a>
				</h3>
				<div class="tags">
					<p>React</p>
					<p>GraphQL</p>
					<p>Gatsby</p>
				</div>
			</div>
			<div class="card">
				<h3>
					<a
						target="_blank"
						aria-label="Levelup Tutorials"
						href="https://leveluptutorials.com"
						rel="noreferrer"
					>
						LevelupTutorials
					</a>{' '}
					-{' '}
					<a
						target="_blank"
						aria-label="Scott Tolinski"
						href="https://www.scotttolinski.com"
						rel="noreferrer"
					>
						Scott Tolinski
					</a>
				</h3>
				<div class="tags">
					<p>React</p>
					<p>TypeScript</p>
					<p>Svelte Kit</p>
					<p>Remix</p>
					<p>Figma</p>
					<p>Design Systems</p>
				</div>
			</div>
			<div class="card">
				<h3>
					<a
						target="_blank"
						aria-label="Levelup Tutorials"
						href="https://leveluptutorials.com"
						rel="noreferrer"
					>
						LevelupTutorials
					</a>{' '}
					-{' '}
					<a
						target="_blank"
						aria-label="Amy Kapernick"
						href="https://www.amyskapers.dev/"
						rel="noreferrer"
					>
						Amy Kapernick
					</a>
				</h3>
				<div class="tags">
					<p>Accessibility for Everyone</p>
				</div>
			</div>
			<div class="card">
				<h3>
					<a
						target="_blank"
						aria-label="Andrew Mead on Udemy"
						href="https://www.udemy.com/user/andrewmead/"
						rel="noreferrer"
					>
						Andrew Mead
					</a>
				</h3>
				<div class="tags">
					<p>GraphQL</p>
					<p>Apollo</p>
					<p>Prisma</p>
				</div>
			</div>
			<div class="card">
				<h3>
					<a
						target="_blank"
						aria-label="Steven Grider on Udemy"
						href="https://www.udemy.com/user/sgslo/"
						rel="noreferrer"
					>
						Steven Grider
					</a>
				</h3>
				<div class="tags">
					<p>React</p>
					<p>Redux</p>
					<p>Docker</p>
					<p>GraphQL</p>
					<p>CSS</p>
					<p>HTML</p>
					<p>JS</p>
				</div>
			</div>
			<div class="card">
				<h3>
					<a
						target="_blank"
						aria-label="Jonas Schmedtmann on Udemy"
						href="https://www.udemy.com/user/jonasschmedtmann/"
						rel="noreferrer"
					>
						Jonas Schmedtmann
					</a>
				</h3>
				<div class="tags">
					<p>CSS</p>
					<p>HTML</p>
					<p>JS</p>
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
					grid-template-columns: minmax(400px, 0.5fr);
					align-items: center;
					justify-content: center;
				"
			>
				<figure>
					<Picture placeholder={space_needle_blurred} src="images/space_needle.png" alt="Clip art of the Seattle space needle">
						{#each space_needle as { src, format }}
							<source data-srcset={src} type="image/{format}" />
						{/each}
					</Picture>
					<p class="center">Seattle Space Needle</p>
				</figure>
			</div>
		</div>
		<div>
			<p>Bringing these two cats, Turnip and Taco, along for the ride.</p>
			<div class="cat-pics">
				<figure>
					<Picture placeholder={tortie_derp_blurred} src="images/tortie_derp.jpg" alt="Turnip Cat">
						{#each tortie_derp as { src, format }}
							<source data-srcset={src} type="image/{format}" />
						{/each}
					</Picture>
					<p class="center">Turnip</p>
				</figure>
				<figure>
					<Picture placeholder={orange_derp_blurred} src="images/orange_derp.jpg" alt="Taco Cat">
						{#each orange_derp as { src, format }}
							<source data-srcset={src} type="image/{format}" />
						{/each}
					</Picture>
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

	.about {
		display: grid;
		grid-gap: 2.5rem;

		p {
			margin: 1rem;
			padding: 0.2rem;
		}
	}

	.tech-list {
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		grid-gap: 1rem;
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
		justify-content: center;
		align-items: center;
		gap: 1.5rem;

		@media (max-width: 1000px) {
			grid-template-columns: repeat(2, auto);
			--cardHeightMin: 20rem;
		}

		@media (max-width: 700px) {
			--cardHeightMin: 10rem;
			grid-template-columns: 0.8fr;
		}
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		justify-content: left;
		align-items: center;

		p {
			background-color: var(--linkHover);
			color: var(--buttonTextColor);
			padding: 0.25rem 0.5rem;
			margin: 0.5rem 0.25rem;
			border-radius: 2px;
			font-weight: 800;
			font-size: 1.2rem;
		}
	}

	.cat-pics {
		display: grid;
		grid-template-columns: repeat(2, minmax(200px, 0.3fr));
		align-items: center;
		justify-content: center;
	}
</style>