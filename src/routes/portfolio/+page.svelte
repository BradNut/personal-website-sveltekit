<script lang="ts">
  import {
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
  } from "@rgossiaux/svelte-headlessui";
	import { Image, Picture } from "svelte-lazy-loader";
	import personalSite from "$lib/assets/images/Bradley_Shellnut_New_Site.png?format=webp;avif;png&metadata";
	import personalSiteBlurred from "$lib/assets/images/Bradley_Shellnut_New_Site.png?w=100&png&blur=10";
  import weddingWebsite from "$lib/assets/images/Wedding_Website.png?format=webp;avif;png&metadata";
	import weddingWebsiteBlurred from "$lib/assets/images/Wedding_Website.png?w=100&png&blur=10";
	import oldSite from '$lib/assets/images/Old_Website_Bradley_Shellnut.png?format=webp;avif;png&metadata';
	import oldSiteBlurred from '$lib/assets/images/Old_Website_Bradley_Shellnut.png?w=100&png&blur=10';
  import shellnutArchitectWebsite from "$lib/assets/images/Mark_Shellnut_Architect.png?format=webp;avif;png&metadata";
	import shellnutArchitectWebsiteBlurred from "$lib/assets/images/Mark_Shellnut_Architect.png?w=100&png&blur=10";
</script>

<svelte:head>
	<title>Portfolio | Bradley Shellnut</title>
</svelte:head>

<h1>Portfolio!</h1>
<div class="portfolioTabStyles">
	<TabGroup>
		<TabList
			aria-label="tabs portfolios"
			style="
				display: grid;
				gap: 1rem;
				grid-template-columns: auto auto;
				place-content: start;
				place-items: center;
				margin-bottom: 1.5rem;
			"
		>
			<Tab class={({selected}) => selected ? "tab-selected portfolio-tab" : "tab-unselected portfolio-tab"}>
				<h2>Personal Sites</h2>
			</Tab>
			<Tab value="professional-sites" class={({selected}) => selected ? "tab-selected  portfolio-tab" : "tab-unselected  portfolio-tab"}>
				<h2>Professional Sites</h2>
			</Tab>
		</TabList>
		<TabPanels>
			<TabPanel>
				<div class="portfolioStyles">
					<div class="gridItemStyles">
						<div>
							<h2>Personal Website</h2>
							<div>
								<Picture placeholder={personalSiteBlurred} src="images/Bradley_Shellnut_New_Site.png" alt="Home Page of bradleyshellnut.com">
									{#each personalSite as { src, format }}
										<source data-srcset={src} type="image/{format}" />
									{/each}
								</Picture>
							</div>
						</div>
						<div>
							<p>
								My personal website written using the following
								technologies.
							</p>
							<p>Tech Stack:</p>
							<ul>
								<li>React 18</li>
								<li>Gatsby 5</li>
								<li>
									<a
										target="_blank"
										href="https://radix-ui.com"
										title="Radix UI"
										rel="noreferrer"
									>
										Radix UI
									</a>
								</li>
								<li>Styled Components</li>
								<li>GraphQL</li>
								<li>Deployed using Netlify</li>
								<li>
									Most icons from{' '}
									<a
										target="_blank"
										href="https://github.com/react-icons/react-icons"
										title="react icons"
										rel="noreferrer"
									>
										react-icons
									</a>
								</li>
								<li>
									Bee, Shell, Nut, and Seattle Icons made by{' '}
									<a
										target="_blank"
										href="https://www.flaticon.com/authors/freepik"
										title="Freepik"
										rel="noreferrer"
									>
										"Freepik"
									</a>{' '}
									from{' '}
									<a
										target="_blank"
										href="https://www.flaticon.com/"
										title="Flaticon"
										rel="noreferrer"
									>
										flaticon.com
									</a>
								</li>
							</ul>
							<p>
								Current version was improved after the suggestions on{' '}
								<a
									href="https://syntax.fm/show/444/syntax-highlight#t=33:19"
									target="_blank"
									aria-label="Syntax.fm Podcast Number 444"
									rel="noreferrer"
								>
									Show 444
								</a>{' '}
								of the{' '}
								<a
									href="https://syntax.fm/show/444/syntax-highlight#t=33:19"
									target="_blank"
									aria-label="Syntax.fm Podcast"
									rel="noreferrer"
								>
									Syntax Podcast
								</a>
								.
							</p>
							<p>
								Previous archived version of my{' '}
								<a
									href="https://web.archive.org/web/20210224002046/https://bradleyshellnut.com/"
									target="_blank"
									aria-label="Archive before Syntax Podcast"
									rel="noreferrer"
								>
									personal website
								</a>
								.
							</p>
						</div>
					</div>
					<div class="gridItemStyles">
						<div>
							<h2>Wedding Website</h2>
							<div>
								<Picture placeholder={weddingWebsiteBlurred} src="images/Wedding_Website.png" alt="Wedding Website">
									{#each weddingWebsite as { src, format }}
										<source data-srcset={src} type="image/{format}" />
									{/each}
								</Picture>
							</div>
							<p>
								<a
									href="https://weddingsite-six.vercel.app/"
									target="_blank"
									aria-label="Wedding Website"
									rel="noreferrer"
								>
									View Site
								</a>{' '}
								<a
									href="https://weddingsite-six.vercel.app/"
									target="_blank"
									aria-label="Wedding Website"
									rel="noreferrer"
								>
									<!-- <RiExternalLinkLine /> -->
								</a>
							</p>
							<p>
								<a
									href="https://github.com/BradNut/weddingsite"
									target="_blank"
									aria-label="Github Repo for the wedding site"
									rel="noreferrer"
								>
									Github Repo
								</a>{' '}
								<a
									href="https://github.com/BradNut/weddingsite"
									target="_blank"
									aria-label="Github Repo for the wedding site"
									rel="noreferrer"
								>
									<!-- <FaGithub /> -->
								</a>
							</p>
						</div>
						<div>
							<p>
								An application that allows viewing of wedding details and
								provides the ability to RSVP to the wedding.
							</p>
							<p>
								The app was initially created for my wedding but what is
								linked here is a public demo of the application.
							</p>
							<p>Tech stack:</p>
							<ul>
								<li>Next.js 13</li>
								<li>React 18</li>
								<li>
									<a
										target="_blank"
										href="https://radix-ui.com"
										title="Radix UI"
										rel="noreferrer"
									>
										Radix UI
									</a>
								</li>
								<li>MongoDB</li>
								<li>Styled Components</li>
								<li>Next Iron Session</li>
							</ul>
						</div>
					</div>
					<div class="gridItemStyles">
						<div>
							<h2>Old Personal Website</h2>
							<div>
								<Picture placeholder={oldSiteBlurred} src="images/Old_Website_Bradley_Shellnut.png" alt="Home Page of the old bradleyshellnut.com website">
									{#each oldSite as { src, format }}
										<source data-srcset={src} type="image/{format}" />
									{/each}
								</Picture>
							</div>
							<p>
								<a
									href="https://web.archive.org/web/20201205233507/https://bradleyshellnut.com/about"
									target="_blank"
									aria-label="Archive of bradleyshellnut.com"
									rel="noreferrer"
								>
									Link to an archive snapshot
								</a>
							</p>
						</div>
						<div>
							<p>
								This was my first real personal website hosted on
								DigitalOcean. It was built using the following:
							</p>
							<ul>
								<li>React</li>
								<li>Redux for any state management</li>
								<li>ReactStrap for CSS grid management</li>
								<li>React Router for routing links in the page</li>
							</ul>
						</div>
					</div>
				</div>
			</TabPanel>
			<TabPanel>
				<div class="gridItemStyles">
					<div>
						<h2>Mark Shellnut Architect </h2>
						<div>
							<Picture placeholder={shellnutArchitectWebsiteBlurred} src="images/Mark_Shellnut_Architect.png" alt="Mark Shellnut Architect's Website">
								{#each shellnutArchitectWebsite as { src, format }}
									<source data-srcset={src} type="image/{format}" />
								{/each}
							</Picture>
						</div>
						<p>
							<a
								href="https://markshellnutarchitect.com/"
								target="_blank"
								aria-label="Mark Shellnut Architect"
								rel="noreferrer"
							>
								View Site
							</a>{' '}
							<a
								href="https://markshellnutarchitect.com/"
								target="_blank"
								aria-label="Mark Shellnut Architect"
								rel="noreferrer"
							>
								<!-- <RiExternalLinkLine /> -->
							</a>
						</p>
					</div>
					<div>
						<p>Company website for Mark Shellnut Architect.</p>
						<p>Tech stack:</p>
						<ul>
							<li>React 18</li>
							<li>Gatsby 5</li>
							<li>
								<a
									target="_blank"
									href="https://radix-ui.com"
									title="Radix UI"
									rel="noreferrer"
								>
									Radix UI
								</a>
							</li>
							<li>Styled Components</li>
							<li>GraphQL</li>
							<li>Lambda Functions</li>
						</ul>
					</div>
				</div>
			</TabPanel>
		</TabPanels>
	</TabGroup>
</div>

<style lang="postcss">
	:global(img) {
		border-radius: 3px;
	}

	:global(.portfolioStyles) {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: repeat(auto, minmax(300px, 400px));
		gap: 3rem;
		margin: 0.5rem auto;

		@media (max-width: 767px) {
			grid-template-columns: repeat(1, minmax(150px, 400px));
			grid-gap: 1.2rem;
			margin: 0.2rem 0;
		}
	}

	:global(.gridItemStyles) {
		display: grid;
		grid-template-columns: minmax(200px, 0.5fr) 0.5fr;
		width: 100%;
		gap: 2rem;
		margin: 0 auto;

		@media (max-width: 767px) {
			grid-template-columns: 1fr;
		}

		img {
			border-radius: 3px;
			max-width: 800px;
		}

		p {
			margin: 1rem 0;
			padding: 0;
		}
	}

	:global(.tab-unselected) {
		h2 {
			border-bottom: 2px solid var(--white);
		}
	}
	
	:global(.tab-selected) {
		h2 {
			border-bottom: 2px solid var(--shellYellow);
		}
	}
</style>