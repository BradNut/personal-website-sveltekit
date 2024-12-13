<script lang="ts">
import cruise from '$lib/assets/images/cruise.png?enhanced';
import orange_derp from '$lib/assets/images/orange_derp.jpg?enhanced';
import tortie_derp from '$lib/assets/images/tortie_derp.jpg?enhanced';
import turnip from '$lib/assets/images/turnip.svg';
import type { Course } from '$lib/types/courses';
import { dockerIcon, drizzleIcon, nextDotJsIcon, reactIcon, svelteIcon, typescriptIcon } from '$lib/util/logoIcons.svelte';
import CourseCard from './CourseCard.svelte';
import TechListItem from './TechListItem.svelte';
import courseData from './course.json';
import ExternalLink from '$lib/components/ExternalLink.svelte';

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
			<ExternalLink
			  iconData={{ type: 'svg', icon: svelteIcon, iconClass: 'center' }}
				linkData={{ href: 'https://svelte.dev', ariaLabel: 'Svelte', title: 'Svelte', target: '_blank', clazz: "tech-list-item", textDecoration: 'none' }}
				textData={{ text: "Svelte", showIcon: true, location: 'bottom' }}
			/>
			<ExternalLink
			  iconData={{ type: 'svg', icon: typescriptIcon, iconClass: 'center' }}
				linkData={{ href: 'https://www.typescriptlang.org/', ariaLabel: 'TypeScript', title: 'TypeScript', target: '_blank', clazz: "tech-list-item", textDecoration: 'none' }}
				textData={{ text: "TypeScript", showIcon: true, location: 'bottom' }}
			/>
			<ExternalLink
			  iconData={{ type: 'svg', icon: drizzleIcon, iconClass: 'center' }}
				linkData={{ href: 'https://orm.drizzle.team/', ariaLabel: 'Drizzle ORM', title: 'Drizzle ORM', target: '_blank', clazz: "tech-list-item", textDecoration: 'none' }}
				textData={{ text: "Drizzle ORM", showIcon: true, location: 'bottom' }}
			/>
			<ExternalLink
			  iconData={{ type: 'svg', icon: reactIcon, iconClass: 'center' }}
				linkData={{ href: 'https://reactjs.org/', ariaLabel: 'React', title: 'React', target: '_blank', clazz: "tech-list-item", textDecoration: 'none' }}
				textData={{ text: "React", showIcon: true, location: 'bottom' }}
			/>
			<ExternalLink
			  iconData={{ type: 'svg', icon: nextDotJsIcon, iconClass: 'center' }}
				linkData={{ href: 'https://nextjs.org/', ariaLabel: 'Next.js', title: 'Next.js', target: '_blank', clazz: "tech-list-item", textDecoration: 'none' }}
				textData={{ text: "Next.js", showIcon: true, location: 'bottom' }}
			/>
			<ExternalLink
			  iconData={{ type: 'svg', icon: dockerIcon, iconClass: 'center' }}
				linkData={{ href: 'https://www.docker.com/', ariaLabel: 'Docker', title: 'Docker', target: '_blank', clazz: "tech-list-item", textDecoration: 'none' }}
				textData={{ text: "Docker", showIcon: true, location: 'bottom' }}
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
				Recently cruised the Mediterranean.
			</p>
			<div
				style="
					display: grid;
					grid-template-columns: minmax(200px, 400px);
					align-items: center;
					justify-content: center;
				"
			>
				<enhanced:img src={cruise} alt="Clip art of a cruise ship. Cruise icons created by C-mo Box - Flaticon" />
				<p class="center">Crusin'</p>
			</div>
		</div>
		<div>
			<p>Hanging out with these two cats, Turnip and Taco.</p>
			<div class="cat-pics">
				<figure>
					<enhanced:img src={tortie_derp} alt="Tortie Cat" />
					<p class="center">Turnip <img class="icon" src={String(turnip)} width="25px" height="25px" alt="Turnip" /></p>
				</figure>
				<figure>
					<enhanced:img src={orange_derp} alt="Tortie Cat" />
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
		gap: 2rem;
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