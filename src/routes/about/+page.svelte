<script lang="ts">
	import Graphql from '@iconify-icons/simple-icons/graphql';
	import Nextdotjs from '@iconify-icons/simple-icons/nextdotjs';
	import Prisma from '@iconify-icons/simple-icons/prisma';
	import Gatsby from '@iconify-icons/simple-icons/gatsby';
	import Docker from '@iconify-icons/simple-icons/docker';
	import React from '@iconify-icons/simple-icons/react';
	import Remix from '@iconify-icons/simple-icons/remix';
	import Svelte from '@iconify-icons/simple-icons/svelte';
	import TypeScript from '@iconify-icons/simple-icons/typescript';
	import LazyImage from '$lib/components/LazyImage.svelte';
	import antarctica from '$lib/assets/images/antarctica.png?as=run:0';
	import tortie_derp from '$lib/assets/images/tortie_derp.jpg?as=run';
	import orange_derp from '$lib/assets/images/orange_derp.jpg?as=run';
	import turnip from '$lib/assets/images/turnip.svg';
	import CourseCard from './CourseCard.svelte';
	import courseData from './course.json';
	import type { Course } from '$root/lib/types/courses';
	import TechListItem from './TechListItem.svelte';

	const courses: Course[] = courseData.courses;
</script>

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
		<div class="tech-list">
			<TechListItem
				itemText="React"
				ariaLabel="React"
				href="https://reactjs.org/"
				clazz="center"
				icon={React}
			/>
			<TechListItem
				itemText="TypeScript"
				ariaLabel="TypeScript"
				href="https://www.typescriptlang.org/"
				clazz="center"
				icon={TypeScript}
			/>
			<TechListItem
				itemText="Svelte"
				ariaLabel="Svelte"
				href="https://svelte.dev"
				clazz="center"
				icon={Svelte}
			/>
			<TechListItem
				itemText="NextJS"
				ariaLabel="NextJS"
				href="https://nextjs.org/"
				clazz="center"
				icon={Nextdotjs}
			/>
			<TechListItem
				itemText="Remix"
				ariaLabel="Remix"
				href="https://remix.run/"
				clazz="center"
				icon={Remix}
			/>
			<TechListItem
				itemText="GraphQL"
				ariaLabel="GraphQL"
				href="https://graphql.org/"
				clazz="center"
				icon={Graphql}
			/>
			<TechListItem
				itemText="Prisma"
				ariaLabel="Prisma"
				href="https://prisma.io/"
				clazz="center"
				icon={Prisma}
			/>
		  <TechListItem
				itemText="GatsbyJS"
				ariaLabel="GatsbyJS"
				href="https://gatsbyjs.com/"
				clazz="center"
				icon={Gatsby}
			/>
			<TechListItem
				itemText="Docker"
				ariaLabel="Docker"
				href="https://docker.com/"
				clazz="center"
				icon={Docker}
			/>
		</div>
	</div>
	<div>
		<h2>Extracurricular</h2>
		<p>
			Outside of work I like to take tutorials from many instructors like
			those below:
		</p>
		<div class="extracurricular">
			{#each courses as course}
				<CourseCard {course} />
			{/each}
		</div>
	</div>
	<div>
		<h2>Other fun things about me&hellip;</h2>
		<div style="display: grid;">
			<p>
				Recently visited Antarctica.
			</p>
			<div
				style="
					display: grid;
					grid-template-columns: minmax(200px, 400px);
					align-items: center;
					justify-content: center;
				"
			>
				<LazyImage src={antarctica} alt="Clip art of Antarctica" />
				<p class="center">Antarctica</p>
			</div>
		</div>
		<div>
			<p>Hanging out with these two cats, Turnip and Taco.</p>
			<div class="cat-pics">
				<figure>
					<LazyImage src={tortie_derp} alt="Turnip Cat" />
					<p class="center">Turnip <img class="icon" src={String(turnip)} width="25px" height="25px" alt="Turnip" /></p>
				</figure>
				<figure>
					<LazyImage src={orange_derp} alt="Taco Cat" />
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

		& p {
			margin: 1rem;
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
	}

	.extracurricular {
		display: flex;
		flex-wrap: wrap;
		place-content: center;
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

	.cat-pics {
		display: grid;
		grid-template-columns: repeat(2, minmax(200px, 0.3fr));
		align-items: center;
		justify-content: center;
		gap: 2rem;
	}
</style>