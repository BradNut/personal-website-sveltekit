<script lang="ts">
	import Img from '@zerodevx/svelte-img';
	import desktop from '$lib/assets/images/Desktop_so_clean.jpg?run';
</script>

<svelte:head>
	<title>Uses | Bradley Shellnut</title>
</svelte:head>

<div class="uses">
	<div>
		<h1>/Uses</h1>
		<p>
			Inspired by
			<a
				target="_blank"
				href="https://wesbos.com"
				aria-label="Wes Bos's website"
				rel="noreferrer"
			>
				Wes Bos's
			</a>
			<a
				target="_blank"
				href="https://wesbos.com/uses"
				aria-label="WesBos Uses Site"
				rel="noreferrer"
			>
				/uses
			</a>
			page and
			<a
				target="_blank"
				href="https://uses.tech/"
				aria-label="Uses list website"
				rel="noreferrer"
			>
				uses.tech
			</a>, this is a list of what I use everyday for my work and personal life.
		</p>
	</div>
	<div class="uses-block-styles">
		<figure>
			<Img class="portfolio-image better-blur" style="max-height: 480px; max-width: 520px;" src={desktop} alt="Clean desk with Samsung monitor and Ducky Keyboard" loading="eager" />
		</figure>
		<h2>Hardware & Accessories</h2>
		<ul>
			<li>MacBook Pro 15-inch for work.</li>
			<li>
				Personal desktop running
				<a
					target="_blank"
					aria-label="PopOS Linux Distro"
					title="https://pop.system76.com/"
					href="https://pop.system76.com/"
					rel="noreferrer"
				>
					PopOS
				</a>
				.
			</li>
			<li>Dell XPS 13 running PopOS.</li>
			<li>
				Phone 📱: Pixel 6 running
				<a
					target="_blank"
					aria-label="GrapheneOS"
					title="https://grapheneos.org/"
					href="https://grapheneos.org/"
					rel="noreferrer"
				>
					GrapheneOS
				</a>
				.
			</li>
			<li>
				Keyboard ⌨️:
				<a
					target="_blank"
					aria-label="Ducky Keyboard"
					title="https://www.duckychannel.com.tw/en/"
					href="https://www.duckychannel.com.tw/en/Ducky-One2-RGB-TKL"
					rel="noreferrer"
				>
					Ducky One 2 RGB TKL Keyboard
				</a>
			</li>
			<li>
				Mouse 🖱️:
				<a
					target="_blank"
					aria-label="Logitech G502 Gaming Mouse"
					title="Amazon Link to Mouse"
					href="https://www.amazon.com/Logitech-G502-Performance-Gaming-Mouse/dp/B07GBZ4Q68"
					rel="noreferrer"
				>
					Logitech G502 Gaming Mouse
				</a>
			</li>
			<li>
				Chair 🪑:
				<a
					target="_blank"
					aria-label="Secretlab Omega 2020 Fabric"
					title="https://secretlabus.myshopify.com"
					href="https://secretlabus.myshopify.com/collections/omega-series#omega_2020-stealth"
					rel="noreferrer"
				>
					SecretLab Omega 2020 Fabric
				</a>
			</li>
			<li>
				Monitor 🖥️:
				<a
					target="_blank"
					aria-label="Samsung Odyssey G7 Gaming Monitor"
					title="Samsung Link to Monitor"
					href="https://www.samsung.com/us/computing/monitors/gaming/32--odyssey-g7-gaming-monitor-lc32g75tqsnxza/"
					rel="noreferrer"
				>
					Samsung Odyssey G7 Gaming Monitor
				</a>
			</li>
		</ul>
	</div>
	<div class="uses-block-styles">
		<h2>Development</h2>
		<p>
			My development setup has been documented here:
			<a
				target="_blank"
				aria-label="Bradley Shellnut Computer Setup"
				href="https://github.com/BradNut/computer-setup-info/blob/master/linux/Environment-Setup.md"
				rel="noreferrer"
			>
				Computer Setup Info
			</a>
			{'. '}
		</p>
		<p>
			And documentation for my terminal and coding setup can be found here:
			<a
				target="_blank"
				aria-label="Bradley Shellnut Dotfiles"
				href="https://github.com/BradNut/dotfiles"
				rel="noreferrer"
			>
				Dotfiles
			</a>
			.
		</p>
		<h3>Terminal & Shell Setup</h3>
		<ul>
			<li>
				On Linux just the built in terminal running ZSH and <a target="_blank" aria-label="Starship prompt" href="https://starship.rs" rel="noreferrer">Starship</a>.
			</li>
			<li>
				<a
					target="_blank"
					aria-label="iTerm 2 Terminal"
					href="https://iterm2.com/"
					rel="noreferrer"
				>
					iTerm2
				</a>
			</li>
			<li>
				<a
					target="_blank"
					aria-label="Oh My Zsh Link"
					href="https://github.com/robbyrussell/oh-my-zsh"
					rel="noreferrer"
				>
					Oh My Zsh
				</a>
				{': '}
				Plugins I use are listed below:
				<div class="uses-flat-list">
					<li>
						<a
							target="_blank"
							aria-label="Z plugin"
							href="https://github.com/agkozak/zsh-z"
							rel="noreferrer"
						>
							Z
						</a>
					</li>
					<li>
						<a
							target="_blank"
							aria-label="Autosuggestion plugin"
							href="https://github.com/zsh-users/zsh-autosuggestions"
							rel="noreferrer"
						>
							zsh-autosuggestions
						</a>
					</li>
					<li>
						<a
							target="_blank"
							aria-label="Syntax highlighting plugin"
							href="https://github.com/zsh-users/zsh-syntax-highlighting"
							rel="noreferrer"
						>
							zsh-syntax-highlighting
						</a>
					</li>
				</div>
			</li>
		</ul>
		<h3>Useful System Packages</h3>
		<div class="uses-flat-list">
			<li>
				<a
					target="_blank"
					aria-label="Linux Brew Link"
					href="https://docs.brew.sh/Homebrew-on-Linux"
					rel="noreferrer"
				>
					Linux Brew
				</a>
			</li>
			<li>
				<a
					target="_blank"
					aria-label="Homebrew Link"
					href="https://brew.sh/"
					rel="noreferrer"
				>
					Homebrew
				</a>
			</li>
			<li>
				<a
					target="_blank"
					aria-label="TLDR Man Pages"
					href="https://tldr.sh/"
					rel="noreferrer"
				>
					TLDR Man Pages
				</a>
			</li>
			<li>
				<a
					target="_blank"
					aria-label="Trash-CLI"
					href="https://www.npmjs.com/package/trash-cli"
					rel="noreferrer"
				>
					Trash-CLI
				</a>
			</li>
		</div>
		<h3>Software</h3>
		<ul>
			<li>
				<a
					target="_blank"
					href="https://vscodium.com/"
					aria-label="VS Codium Website"
					rel="noreferrer"
				>
					VSCodium
				</a>
				: Editor for non-Java projects. List of mostly used extensions:
				<a
					target="_blank"
					href="https://github.com/BradNut/dotfiles/blob/master/vs-code-extensions-i-use.md"
					aria-label="VS Code Extensions"
					rel="noreferrer"
				>
					VSCode Extensions
				</a>
			</li>
			<li>
				<a
					target="_blank"
					href="https://www.sublimetext.com/3"
					aria-label="Sublime Text 3 Website"
					rel="noreferrer"
				>
					Sublime Text 3
				</a>
				: Text editor of choice with the following packages installed:
				<div class="uses-flat-list">
					<li>
						<a
							target="_blank"
							href="https://packagecontrol.io/packages/HTML-CSS-JS%20Prettify"
							aria-label="Prettify Package"
							rel="noreferrer"
						>
							HTML-CSS-JS Prettify
						</a>
					</li>
					<li>
						<a
							target="_blank"
							href="https://packagecontrol.io/packages/A%20File%20Icon"
							aria-label="A File Icon"
							rel="noreferrer"
						>
							A File Icon
						</a>
					</li>
					<li>
						<a
							target="_blank"
							href="https://packagecontrol.io/packages/ColorPicker"
							aria-label="Color Picker Package"
							rel="noreferrer"
						>
							Color Picker
						</a>
					</li>
					<li>
						<a
							target="_blank"
							href="https://packagecontrol.io/packages/Gutter%20Color"
							aria-label="Git Gutter Color Package"
							rel="noreferrer"
						>
							Gutter Color
						</a>
					</li>
					<li>
						<a
							target="_blank"
							href="https://github.com/absop/RainbowBrackets"
							aria-label="Rainbow Brackets Package"
							rel="noreferrer"
						>
							Rainbow Brackets
						</a>
					</li>
					<li>
						<a
							target="_blank"
							href="https://packagecontrol.io/packages/Theme%20-%20Cobalt2"
							aria-label="Cobalt2 Theme"
							rel="noreferrer"
						>
							Cobalt2 Theme
						</a>
					</li>
				</div>
			</li>
			<li>
				<a
					target="_blank"
					href="https://jetbrains.com/idea/"
					aria-label="IntelliJ IDEA"
					rel="noreferrer"
				>
					IntelliJ Ultimate
				</a>
				: Used mainly for Java/Kotlin projects running Tomcat Servers,
				Spring/Spring Boot projects, etc. I usually use the following
				plugins:
				<div class="uses-flat-list">
					<li>
						<a
							target="_blank"
							href="https://plugins.jetbrains.com/plugin/7499-gittoolbox"
							aria-label="Git Helper Plugin"
							rel="noreferrer"
						>
							GitToolBox
						</a>
					</li>
					<li>
						<a
							target="_blank"
							href="https://plugins.jetbrains.com/plugin/6954-kotlin"
							aria-label="Kotlin Helper Plugin"
							rel="noreferrer"
						>
							Kotlin
						</a>
					</li>
					<li>
						<a
							target="_blank"
							href="https://plugins.jetbrains.com/plugin/6317-lombok"
							aria-label="Lombok Plugin"
							rel="noreferrer"
						>
							Lombok
						</a>
					</li>
					<li>
						<a
							target="_blank"
							href="https://plugins.jetbrains.com/plugin/10456-prettier"
							aria-label="Prettier Formatter"
							rel="noreferrer"
						>
							Prettier
						</a>
					</li>
					<li>
						<a
							target="_blank"
							href="https://plugins.jetbrains.com/plugin/7973-sonarlint"
							aria-label="Java Linter"
							rel="noreferrer"
						>
							Sonar Lint
						</a>
					</li>
					<li>
						<a
							target="_blank"
							href="https://plugins.jetbrains.com/plugin/12255-visual-studio-code-dark-plus-theme"
							aria-label="VS Code Theme for IntelliJ"
							rel="noreferrer"
						>
							VS Code Dark Plus Theme
						</a>
					</li>
				</div>
			</li>
			<li>
				<a
					target="_blank"
					aria-label="Postman Website"
					href="https://postman.com/"
					rel="noreferrer"
				>
					Postman
				</a>
				: My go to multi-platform Posting utility
			</li>
			<li>
				Browser of choice:
				<a
					target="_blank"
					aria-label="Firefox Best Edition"
					href="https://www.mozilla.org/en-US/firefox/developer/"
					rel="noreferrer"
				>
					Firefox Developer Edition
				</a>
			</li>
		</ul>
	</div>
	<div class="uses-block-styles">
		<h2>Privacy Hardware and Software</h2>
		<p>
			For the past few years I've been working towards moving my data to
			self-hosted systems and systems I trust to hold my data.
		</p>
		<p>
			If you want to see more info about this head to my
			<a href="/privacy">Privacy</a> page.
		</p>
		<p>Hardware Authentication</p>
		<ul>
			<li>
				<a
					target="_blank"
					aria-label="YubiKey 5C"
					href="https://www.yubico.com/product/yubikey-5c/"
					rel="noreferrer"
				>
					YubiKey 5C
				</a>
			</li>
		</ul>
		<p>NAS Servers</p>
		<ul>
			<li>
				<a
					target="_blank"
					aria-label="Synology NAS"
					href="https://synology.com/"
					rel="noreferrer"
				>
					Synology DS918+
				</a>
			</li>
			<li>Mac Mini 2015</li>
		</ul>
		<p>Software</p>
		<ul>
			<li>
				<a
					target="_blank"
					aria-label="Bitwarden Password Manager"
					href="https://bitwarden.com/"
					rel="noreferrer"
				>
					Bitwarden
				</a>
			</li>
			<li>
				<a
					target="_blank"
					aria-label="Element Messaging App"
					href="https://element.io/"
					rel="noreferrer"
				>
					Element (Riot.im)
				</a>
			</li>
			<li>
				<a
					target="_blank"
					aria-label="FreeTube Video App"
					href="https://freetubeapp.io/"
					rel="noreferrer"
				>
					FreeTube App
				</a>
			</li>
			<li>
				<a
					target="_blank"
					aria-label="Mullvad VPN"
					href="https://mullvad.net/en/"
					rel="noreferrer"
				>
					Mullvad VPN
				</a>
			</li>
			<li>
				<a
					target="_blank"
					aria-label="Signal Messenger"
					href="https://www.signal.org/"
					rel="noreferrer"
				>
					Signal
				</a>
			</li>
		</ul>
	</div>
</div>

<style lang="postcss">
	figure {
		display: grid;
		grid-template-columns: minmax(400px, 0.65fr);
		place-content: center;
		margin-bottom: 2rem;
	}

	.uses {
		li {
			list-style: none;
			a {
				:hover {
					color: var(--shellYellow);
				}
			}
		}
		p {
			margin: 1rem;
		}

		img {
			border-radius: 3px;
			max-width: 1000px;
		}
	}

 .uses-block-styles {
		margin: 4rem 0;
		@media (max-width: 800px) {
			margin: 2rem 0;
		}

		h3,
		h4,
		h5 {
			margin-top: 1.5rem;
		}
	}

	.uses-flat-list {
		margin: 0.2rem;
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: left;
		align-items: center;

		li {
			padding: 0.5rem;
			margin: 0.5rem;
			list-style: none;
			color: var(--lightShade);
			background-color: var(--darkGrey);
			border-radius: 0.5rem;
			a {
				text-decoration: none;
				:hover {
					color: var(--shellYellow);
				}
			}
		}
	}
</style>