<script lang="ts">
	import ExternalLink from "$lib/components/ExternalLink.svelte";
</script>

<p>
	My development setup has been documented here: <ExternalLink
			linkData={{
				href: "https://github.com/BradNut/computer-setup-info/blob/master/environment/Environment.md",
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
	</p>

	<h3>Terminal & Shell Setup</h3>

	<ul>
		<li>
			Linux: <ExternalLink
				linkData={{ href: "https://ghostty.org", ariaLabel: "Ghostty" }}
				textData={{ text: "Ghostty", showIcon: true, location: "left" }}
			/> running ZSH and <ExternalLink
				linkData={{ href: "https://starship.rs/", ariaLabel: "Starship" }}
				textData={{ text: "Starship", showIcon: true, location: "left" }}
			/> as my prompt.
		</li>
		<li>
			Mac: <ExternalLink
				linkData={{ href: "https://ghostty.org", ariaLabel: "Ghostty for Mac" }}
				textData={{ text: "Ghostty", showIcon: true, location: "left" }}
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
							ariaLabel: "VS Code Extensions",
						}}
						textData={{
							text: "VS Code Extensions",
							showIcon: true,
							location: "left",
						}}
					/>
				</li>
			</ul>
		</li>
		<li>
			<ExternalLink
				linkData={{ href: "https://zed.dev/", ariaLabel: "Zed Editor" }}
				textData={{ text: "Zed Editor", showIcon: true, location: "left" }}
			/>
		</li>
		<li>
			<ExternalLink
				linkData={{
					href: "https://www.sublimetext.com/",
					ariaLabel: "Sublime Text",
				}}
				textData={{ text: "Sublime Text", showIcon: true, location: "left" }}
			/>
			<ul>
				<li>
					My Packages List: <ExternalLink
						linkData={{
							href: "https://github.com/BradNut/dotfiles/blob/master/sublime-text-extensions-i-use.md",
							ariaLabel: "Sublime Text Extensions",
						}}
						textData={{
							text: "Sublime Text Extensions",
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

<style lang="postcss">
	ul {
		padding-inline-start: 4rem;
	}
</style>
