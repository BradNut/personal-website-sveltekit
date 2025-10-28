<script lang="ts">
import ExternalLink from '$lib/components/ExternalLink.svelte';
</script>

<section id="uses-development">
	<h2>Development</h2>

	<p>
		My development setup has been documented here: <ExternalLink
			linkData={{
				href: "https://github.com/BradNut/computer-setup-info/blob/master/linux/Environment-Setup.md",
				ariaLabel: "Bradley Shellnut Computer Setup",
			}}
			textData={{
				text: "Computer Setup Info",
				showIcon: true,
				location: "left",
			}}
		/>.
	</p>

	<p>
		And documentation for my terminal and coding setup can be found here: <ExternalLink
			linkData={{
				href: "https://github.com/BradNut/dotfiles",
				ariaLabel: "Dotfiles",
			}}
			textData={{ text: "Dotfiles", showIcon: true, location: "left" }}
		/>
		>.
	</p>

	<h3>Terminal & Shell Setup</h3>

	<ul>
		<li>
			Linux: <ExternalLink
				linkData={{ href: "https://tabby.sh/", ariaLabel: "Tabby" }}
				textData={{ text: "Tabby terminal", showIcon: true, location: "left" }}
			/> running ZSH and <ExternalLink
				linkData={{ href: "https://starship.rs/", ariaLabel: "Starship" }}
				textData={{ text: "Starship", showIcon: true, location: "left" }}
			/> as my prompt >.
		</li>
		<li>
			Mac: <ExternalLink
				linkData={{ href: "https://iterm2.com/", ariaLabel: "iTerm2" }}
				textData={{ text: "iTerm2", showIcon: true, location: "left" }}
			/>
		</li>
		<li>
			<ExternalLink
				linkData={{ href: "https://zimfw.sh/", ariaLabel: "ZimFW" }}
				textData={{ text: "ZimFW", showIcon: true, location: "left" }}
			/> as my Zsh framework.
		</li>
	</ul>

	<h3>Useful System Packages</h3>

	<ul>
		<li>
			<ExternalLink
				linkData={{
					href: "https://docs.brew.sh/Homebrew-on-Linux",
					ariaLabel: "Linux Brew",
				}}
				textData={{ text: "Linux Brew", showIcon: true, location: "left" }}
			/>
		</li>
		<li>
			<ExternalLink
				linkData={{ href: "https://brew.sh/", ariaLabel: "Homebrew" }}
				textData={{ text: "Homebrew", showIcon: true, location: "left" }}
			/>
		</li>
		<li>
			<ExternalLink
				linkData={{ href: "https://tldr.sh/", ariaLabel: "TLDR Man Pages" }}
				textData={{ text: "TLDR Man Pages", showIcon: true, location: "left" }}
			/>
		</li>
		<li>
			<ExternalLink
				linkData={{
					href: "https://www.npmjs.com/package/trash-cli",
					ariaLabel: "Trash-CLI",
				}}
				textData={{ text: "Trash-CLI", showIcon: true, location: "left" }}
			/>
		</li>
	</ul>

	<h3>Software</h3>

	<ul>
		<li>
			<ExternalLink
				linkData={{ href: "https://vscodium.com/", ariaLabel: "VSCodium" }}
				textData={{ text: "VSCodium", showIcon: true, location: "left" }}
			/>
			<ul>
				<li>
					My extensions list: <ExternalLink
						linkData={{
							href: "https://github.com/BradNut/dotfiles/blob/master/vs-code-extensions-i-use.md",
							ariaLabel: "VSCode Extensions List",
						}}
						textData={{
							text: "VSCode Extensions List",
							showIcon: true,
							location: "left",
						}}
					/>
				</li>
			</ul>
		</li>
		<li>
			<ExternalLink
				linkData={{
					href: "https://www.sublimetext.com/3",
					ariaLabel: "Sublime Text 3",
				}}
				textData={{ text: "Sublime Text 3", showIcon: true, location: "left" }}
			/>
			<ul>
				<li>
					My Packages List: <ExternalLink
						linkData={{
							href: "https://github.com/BradNut/dotfiles/blob/master/sublime-text-extensions-i-use.md",
							ariaLabel: "Sublime Text Packages List",
						}}
						textData={{
							text: "Sublime Text Packages List",
							showIcon: true,
							location: "left",
						}}
					/>
				</li>
			</ul>
		</li>
		<li>
			<ExternalLink
				linkData={{
					href: "https://jetbrains.com/idea/",
					ariaLabel: "IntelliJ IDEA",
				}}
				textData={{ text: "IntelliJ IDEA", showIcon: true, location: "left" }}
			/>
			<ul>
				<li>
					My Plugins List: <ExternalLink
						linkData={{
							href: "https://github.com/BradNut/dotfiles/blob/master/intellij-plugins.md",
							ariaLabel: "IntelliJ Plugins",
						}}
						textData={{
							text: "IntelliJ Plugins",
							showIcon: true,
							location: "left",
						}}
					/>
				</li>
			</ul>
		</li>
	</ul>

	<h3>Useful Applications</h3>

	<ul>
		<li>
			<ExternalLink
				linkData={{ href: "https://www.usebruno.com/", ariaLabel: "Bruno" }}
				textData={{ text: "Bruno", showIcon: true, location: "left" }}
			/>
		</li>
	</ul>

	<h3>Browsers</h3>

	<ul>
		<li>
			<ExternalLink
				linkData={{ href: "https://brave.com/", ariaLabel: "Brave Browser" }}
				textData={{ text: "Brave Browser", showIcon: true, location: "left" }}
			/>
		</li>
		<li>
			<ExternalLink
				linkData={{
					href: "https://www.mozilla.org/en-US/firefox/new/",
					ariaLabel: "Firefox",
				}}
				textData={{ text: "Firefox", showIcon: true, location: "left" }}
			/>
		</li>
	</ul>
</section>

<style land="postcss">
	ul {
    list-style-type: square;
    padding-inline-start: 4rem;
  }
</style>