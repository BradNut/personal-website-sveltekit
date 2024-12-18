<script lang="ts">
	import ExternalLink from "$lib/components/ExternalLink.svelte";
</script>

<section id="uses-development">
	<h2>Development</h2>

	<p>
		My development setup has been documented here: <ExternalLink
			linkData={{ href: "https://github.com/BradNut/computer-setup-info/blob/master/linux/Environment-Setup.md", ariaLabel: "Bradley Shellnut Computer Setup" }}
			textData={{ text: "Computer Setup Info", showIcon: true, location: "left" }} />.
	</p>

	<p>
		And documentation for my terminal and coding setup can be found here: <ExternalLink
			linkData="https://github.com/BradNut/dotfiles"
			textData="Dotfiles">Dotfiles</ExternalLink
		>.
	</p>

	<h3>Terminal & Shell Setup</h3>

	<ul>
		<li>
			Linux default terminal running ZSH and <ExternalLink
				linkData={{ href: "https://starship.rs/", ariaLabel: "Starship" }}
				textData={{ text: "Starship", showIcon: true, location: "left" }} />
			>.
		</li>
		<li>
			Mac: <ExternalLink linkData={{ href: "https://iterm2.com/", ariaLabel: "iTerm2" }} textData={{ text: "iTerm2", showIcon: true, location: "left" }} />
		</li>
		<li>
			<ExternalLink
				linkData="https://github.com/robbyrussell/oh-my-zsh"
				textData="Oh My Zsh">Oh My Zsh</ExternalLink
			>
			<ul>
				<li>
					<ExternalLink linkData="https://github.com/agkozak/zsh-z" textData="Z"
						>Z</ExternalLink
					>
				</li>
				<li>
					<ExternalLink
						linkData="https://github.com/zsh-users/zsh-autosuggestions"
						textData="zsh-autosuggestions">zsh-autosuggestions</ExternalLink
					>
				</li>
				<li>
					<ExternalLink
						linkData="https://github.com/zsh-users/zsh-syntax-highlighting"
						textData="zsh-syntax-highlighting"
						>zsh-syntax-highlighting</ExternalLink
					>
				</li>
			</ul>
		</li>
	</ul>

	<h3>Useful System Packages</h3>

	<ul>
		<li>
			<ExternalLink
				linkData="https://docs.brew.sh/Homebrew-on-Linux"
				textData="Linux Brew">Linux Brew</ExternalLink
			>
		</li>
		<li>
			<ExternalLink linkData="https://brew.sh/" textData="Homebrew"
				>Homebrew</ExternalLink
			>
		</li>
		<li>
			<ExternalLink linkData="https://tldr.sh/" textData="TLDR Man Pages"
				>TLDR Man Pages</ExternalLink
			>
		</li>
		<li>
			<ExternalLink
				linkData="https://www.npmjs.com/package/trash-cli"
				textData="Trash-CLI">Trash-CLI</ExternalLink
			>
		</li>
	</ul>

	<h3>Software</h3>

	<ul>
		<li>
			<ExternalLink linkData="https://vscodium.com/" textData="VSCodium"
				>VSCodium</ExternalLink
			>
			<ul>
				<li>
					My extensions list: <ExternalLink
						linkData="https://github.com/BradNut/dotfiles/blob/master/vs-code-extensions-i-use.md"
						textData="VSCode Extensions List"
						>VSCode Extensions List</ExternalLink
					>
				</li>
			</ul>
		</li>
		<li>
			<ExternalLink
				linkData="https://www.sublimetext.com/3"
				textData="Sublime Text 3">Sublime Text 3</ExternalLink
			>
			<ul>
				<li>
					My Packages List: <ExternalLink
						linkData="https://github.com/BradNut/dotfiles/blob/master/sublime-text-extensions-i-use.md"
						textData="Sublime Text Packages List"
						>Sublime Text Packages List</ExternalLink
					>
				</li>
			</ul>
		</li>
		<li>
			<ExternalLink
				linkData="https://jetbrains.com/idea/"
				textData="IntelliJ Ultimate">IntelliJ Ultimate</ExternalLink
			>
			<ul>
				<li>
					My Plugins List: <ExternalLink
						linkData="https://github.com/BradNut/dotfiles/blob/master/intellij-plugins.md"
						textData="IntelliJ Plugins">IntelliJ Plugins</ExternalLink
					>
				</li>
			</ul>
		</li>
	</ul>

	<h3>Useful Applications</h3>

	<ul>
		<li>
			<ExternalLink linkData="https://postman.com/" textData="Postman"
				>Postman</ExternalLink
			>
		</li>
	</ul>

	<h3>Browsers</h3>

	<ul>
		<li>
			<ExternalLink linkData="https://brave.com/" textData="Brave Browser"
				>Brave Browser</ExternalLink
			>
		</li>
		<li>
			<ExternalLink
				linkData="https://www.mozilla.org/en-US/firefox/new/"
				textData="Firefox">Firefox</ExternalLink
			>
		</li>
	</ul>
</section>
