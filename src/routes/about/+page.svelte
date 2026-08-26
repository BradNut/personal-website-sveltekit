<script lang="ts">
	import { AspectRatio, Separator } from "bits-ui";
	import orange_derp from "../../lib/assets/images/orange_derp.jpg?enhanced";
	import tortie_derp from "../../lib/assets/images/tortie_derp.jpg?enhanced";
	import turnip from "../../lib/assets/images/turnip.svg?enhanced";
	import TechStack from "../../lib/components/TechStack.svelte";
	import ExternalLink from "../../lib/components/ExternalLink.svelte";
	import Badge from "../../lib/components/Badge.svelte";
	import { learningSources } from "$lib/shared/learningSources";
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
	<Separator.Root class="about-separator" decorative={true} />
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
		<TechStack />
	</section>
	<Separator.Root class="about-separator" decorative={true} />
	<section aria-labelledby="extracurricular-heading">
		<h2 id="extracurricular-heading">Extracurricular</h2>
		<p>
			Outside of work, I’ve learned from:
		</p>
		<ul class="learning-sources">
			{#each learningSources as source (source.name)}
				<li class="source-card">
					<h3 class="source-name">
						<ExternalLink
							textData={{ text: source.name, showIcon: true, location: "left" }}
							linkData={{ href: source.href, ariaLabel: source.name, target: "_blank" }}
						/>
					</h3>
					{#if source.notableWork}
						<ExternalLink
							textData={{ text: source.notableWork.text, showIcon: true, location: "left" }}
							linkData={{
								href: source.notableWork.href,
								ariaLabel: `${source.name} — ${source.notableWork.text}`,
								target: "_blank",
								clazz: "notable-work",
							}}
							iconSize={16}
						/>
					{/if}
					<ul class="subjects" aria-label={`Subjects taught by ${source.name}`}>
						{#each source.subjects as subject (subject)}
							<li><Badge variant="outline">{subject}</Badge></li>
						{/each}
					</ul>
				</li>
			{/each}
		</ul>
	</section>
	<Separator.Root class="about-separator" decorative={true} />
	<section aria-labelledby="fun-things-heading">
		<h2 id="fun-things-heading">Other fun things about me&hellip;</h2>
		<div class="travel-section">
			<p>Recently visited Taiwan and Japan.</p>
			<div class="flag-emojis">🇹🇼 🇯🇵 🌸</div>
		</div>
		<div>
			<p class="cat-blurb">Hanging out with these two cats, Turnip and Taco.</p>
			<div class="cat-pics">
				<figure>
					<AspectRatio.Root ratio={4 / 3} class="cat-aspect-root">
						<div class="cat-image-wrapper">
							<enhanced:img src={tortie_derp} alt="Tortie Cat lying down" />
						</div>
					</AspectRatio.Root>
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
					<AspectRatio.Root ratio={4 / 3} class="cat-aspect-root">
						<div class="cat-image-wrapper">
							<enhanced:img src={orange_derp} alt="Orange Cat sleeping" />
						</div>
					</AspectRatio.Root>
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

	:global(.about-separator) {
		background-color: var(--lightHairLine);
		width: 100%;
		height: 1px;
		border: none;
	}

	:global(.cat-aspect-root) {
		position: relative;
		overflow: hidden;
		border-radius: var(--borderRadius);
	}

	.cat-image-wrapper {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.cat-image-wrapper :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.about {
		display: grid;
		grid-gap: 2.5rem;

		& p {
			margin: 1rem;
		}
	}

	.learning-sources {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.5rem;

		@media (max-width: 480px) {
			gap: 1rem;
		}
	}

	.source-card {
		display: grid;
		align-content: start;
		gap: 0.5rem;
		padding: 1rem;
		background-color: var(--cardBg);
		border-radius: var(--borderRadius);
	}

	.source-name {
		margin: 0;
		font-size: var(--bodyTextSize);
	}

	.source-card :global(.notable-work) {
		font-size: var(--smallText);
	}

	.subjects {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
	}

	.cat-blurb {
		font-size: 2.2rem;
	}

	@media (max-width: 480px) {
		.cat-blurb {
			font-size: var(--bodyTextSize);
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
		font-size: var(--bodyTextSize);
	}

	.center {
		text-align: center;
	}
</style>
