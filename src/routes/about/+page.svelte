<script lang="ts">
	import orange_derp from "../../lib/assets/images/orange_derp.jpg?enhanced";
	import tortie_derp from "../../lib/assets/images/tortie_derp.jpg?enhanced";
	import turnip from "../../lib/assets/images/turnip.svg?enhanced";
	import type { Course } from "../../lib/types/courses";
	import {
		dockerIcon,
		drizzleIcon,
		nextDotJsIcon,
		reactIcon,
		svelteIcon,
		typescriptIcon,
		honoIcon,
	} from "../../lib/util/logoIcons.svelte";
	import CourseCard from "./CourseCard.svelte";
	import courseData from "./course.json";
	import ExternalLink from "../../lib/components/ExternalLink.svelte";

	const courses: Course[] = courseData.courses;
</script>

<div class="about">
	<section aria-labelledby="intro-heading">
		<h1 id="intro-heading">About</h1>
		<p>Hey! My name is Bradley Shellnut.</p>
		<p>
			I'm {new Date().getFullYear() - 1991} years old and I am a full stack software
			engineer who's interested in new tech and not afraid to discover new interests.
		</p>
	</section>
	<section aria-labelledby="details-heading">
		<h2 id="details-heading">More deets</h2>
		<p>
			I graduated from Cal Poly San Luis Obispo in 2013 with a Bachelor's degree
			in Computer Engineering.{" "}
			<span class="emoji" title="Software + Hardware"> 💻 </span>
		</p>
		<p>
			At work I develop in Java Spring, Spring Boot, PostgreSQL, and React /
			Angular.
		</p>
		<p>
			At home I delve into other frameworks, languages, and platforms such as:
		</p>
		<div class="tech-list">
			<ExternalLink
				iconData={{ type: "svg", icon: svelteIcon, iconClass: "center" }}
				linkData={{
					href: "https://svelte.dev",
					ariaLabel: "Svelte",
					title: "Svelte",
					target: "_blank",
					clazz: "tech-list-item",
					textDecoration: "none",
				}}
				textData={{ text: "Svelte", showIcon: true, location: "bottom" }}
			/>
			<ExternalLink
				iconData={{ type: "svg", icon: honoIcon, iconClass: "center" }}
				linkData={{
					href: "https://hono.dev",
					ariaLabel: "Hono",
					title: "Hono",
					target: "_blank",
					clazz: "tech-list-item",
					textDecoration: "none",
				}}
				textData={{ text: "Hono", showIcon: true, location: "bottom" }}
			/>
			<ExternalLink
				iconData={{ type: "svg", icon: typescriptIcon, iconClass: "center" }}
				linkData={{
					href: "https://www.typescriptlang.org/",
					ariaLabel: "TypeScript",
					title: "TypeScript",
					target: "_blank",
					clazz: "tech-list-item",
					textDecoration: "none",
				}}
				textData={{ text: "TypeScript", showIcon: true, location: "bottom" }}
			/>
			<ExternalLink
				iconData={{ type: "svg", icon: drizzleIcon, iconClass: "center" }}
				linkData={{
					href: "https://orm.drizzle.team/",
					ariaLabel: "Drizzle ORM",
					title: "Drizzle ORM",
					target: "_blank",
					clazz: "tech-list-item",
					textDecoration: "none",
				}}
				textData={{ text: "Drizzle ORM", showIcon: true, location: "bottom" }}
			/>
			<ExternalLink
				iconData={{ type: "svg", icon: reactIcon, iconClass: "center" }}
				linkData={{
					href: "https://reactjs.org/",
					ariaLabel: "React",
					title: "React",
					target: "_blank",
					clazz: "tech-list-item",
					textDecoration: "none",
				}}
				textData={{ text: "React", showIcon: true, location: "bottom" }}
			/>
			<ExternalLink
				iconData={{ type: "svg", icon: nextDotJsIcon, iconClass: "center" }}
				linkData={{
					href: "https://nextjs.org/",
					ariaLabel: "Next.js",
					title: "Next.js",
					target: "_blank",
					clazz: "tech-list-item",
					textDecoration: "none",
				}}
				textData={{ text: "Next.js", showIcon: true, location: "bottom" }}
			/>
			<ExternalLink
				iconData={{ type: "svg", icon: dockerIcon, iconClass: "center" }}
				linkData={{
					href: "https://www.docker.com/",
					ariaLabel: "Docker",
					title: "Docker",
					target: "_blank",
					clazz: "tech-list-item",
					textDecoration: "none",
				}}
				textData={{ text: "Docker", showIcon: true, location: "bottom" }}
			/>
		</div>
	</section>
	<section aria-labelledby="extracurricular-heading">
		<h2 id="extracurricular-heading">Extracurricular</h2>
		<p>
			Outside of work I like to take tutorials from many instructors like those
			below:
		</p>
		<div class="extracurricular">
			{#each courses as course}
				<CourseCard {course} />
			{/each}
		</div>
	</section>
	<section aria-labelledby="fun-things-heading">
		<h2 id="fun-things-heading">Other fun things about me&hellip;</h2>
		<div class="travel-section">
			<p>Recently visited Taiwan and Japan.</p>
			<div class="flag-emojis">
				🇹🇼 🇯🇵 🌸
			</div>
		</div>
		<div>
			<p>Hanging out with these two cats, Turnip and Taco.</p>
			<div class="cat-pics">
				<figure>
					<enhanced:img src={tortie_derp} alt="Tortie Cat lying down" />
					<figcaption class="center">
						Turnip <img
							class="icon"
							src={String(turnip)}
							width="25px"
							height="25px"
							alt="Turnip icon"
						/>
					</figcaption>
				</figure>
				<figure>
					<enhanced:img src={orange_derp} alt="Orange Cat sleeping" />
					<figcaption class="center">Taco 🌮</figcaption>
				</figure>
			</div>
		</div>
	</section>
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
		gap: 2rem;
		margin-top: 1rem;
		font-size: 2rem;

		@media (max-width: 768px) {
			gap: 1.5rem;
			font-size: 1.8rem;
		}

		@media (max-width: 480px) {
			gap: 1rem;
			font-size: 1.5rem;
		}
	}

	.extracurricular {
		display: flex;
		flex-wrap: wrap;
		place-content: center;
		gap: 1.5rem;

		@media (max-width: 768px) {
			gap: 1rem;
		}
	}

	.travel-section {
		display: grid;
		gap: 1rem;
	}

	.flag-emojis {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		font-size: 5rem;
		padding: 1rem;

		@media (max-width: 768px) {
			font-size: 4rem;
			gap: 0.8rem;
		}

		@media (max-width: 480px) {
			font-size: 3rem;
			gap: 0.5rem;
		}
	}

	.cat-pics {
		display: grid;
		grid-template-columns: repeat(2, minmax(200px, 0.3fr));
		align-items: center;
		justify-content: center;
		gap: 2rem;

		@media (max-width: 768px) {
			grid-template-columns: repeat(2, minmax(150px, 1fr));
			gap: 1.5rem;
		}

		@media (max-width: 480px) {
			grid-template-columns: 1fr;
			gap: 1rem;
		}
	}

	figcaption {
		margin-top: 0.5rem;
	}

	.center {
		text-align: center;
	}
</style>
