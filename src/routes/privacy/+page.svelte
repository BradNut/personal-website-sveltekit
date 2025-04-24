<script lang="ts">
	import ExternalLink from "$lib/components/ExternalLink.svelte";
</script>

<div>
	<h1>Privacy</h1>
	<p>
		Long story short, I believe everyone should know who has your personal data,
		how it is being collected/stored, and what it is being used for.
	</p>
	<p>
		However, it is ultimately up to each person to determine how much data they
		are willing to give to any business/entity.
	</p>
	<p>
		For the sake of transparency I am using <ExternalLink
			textData={{ text: "Umami Analytics", showIcon: true, location: "left" }}
			linkData={{ href: "https://umami.is", ariaLabel: "Umami Analytics" }}
		/> to anonymously track visits to my site. You can completely block this if you
		want by either using an AdBlocker like <ExternalLink
			textData={{ text: "uBlock Origin", showIcon: true, location: "left" }}
			linkData={{
				href: "https://ublockorigin.com/",
				ariaLabel: "uBlock Origin",
			}}
		/>. Sending "Do Not Track" requests in your browser is supported but not
		overall it is not recommended to turn this on since it can be used to
		fingerprint you on the web.
	</p>
</div>
<div>
	<h2>Useful Resources</h2>
	<p>
		Here are a few sites/lists of privacy oriented software for you to check
		out:
	</p>
	<ul>
		<li>
			<ExternalLink
				textData={{ text: "Awesome Privacy", showIcon: true, location: "left" }}
				linkData={{
					href: "https://github.com/Lissy93/awesome-privacy",
					ariaLabel: "Awesome Privacy",
				}}
			/>
		</li>
		<li>
			<ExternalLink
				linkData={{
					href: "https://privacyguides.org/",
					ariaLabel: "Privacy Guides",
				}}
				textData={{ text: "Privacy Guides", showIcon: true, location: "left" }}
			/>
		</li>
		<li>
			<ExternalLink
				linkData={{
					href: "https://ethical.net/resources/",
					ariaLabel: "Ethical Alternatives",
				}}
				textData={{
					text: "Ethical Alternatives",
					showIcon: true,
					location: "left",
				}}
			/>
		</li>
	</ul>
</div>
<div>
	<h3>Privacy Centric Paid Services I use:</h3>
	<ul>
		<li>
			Article Saving: <ExternalLink
				textData={{
					text: "Wallabag Article Saver",
					showIcon: true,
					location: "left",
				}}
				linkData={{
					href: "https://wallabag.com/",
					ariaLabel: "Wallabag Article Saver",
				}}
			/>
		</li>
		<li>
			Anonymous Email Forwarding: <ExternalLink
				textData={{
					text: "SimpleLogin (Now owned by Proton AG)",
					showIcon: true,
					location: "left",
				}}
				linkData={{ href: "https://simplelogin.io", ariaLabel: "SimpleLogin" }}
			/>
		</li>
		<li>
			Email: <ExternalLink
				textData={{ text: "ProtonMail", showIcon: true, location: "left" }}
				linkData={{ href: "https://protonmail.com/", ariaLabel: "ProtonMail" }}
			/>
		</li>
		<li>
			Notes: <ExternalLink
				textData={{ text: "Joplin Notes", showIcon: true, location: "left" }}
				linkData={{ href: "https://joplinapp.org/", ariaLabel: "Joplin Notes" }}
			/>
		</li>
		<li>
			VPN: <ExternalLink
				textData={{ text: "ProtonVPN", showIcon: true, location: "left" }}
				linkData={{ href: "https://protonvpn.com", ariaLabel: "ProtonVPN" }}
			/>
		</li>
	</ul>
</div>
<div>
	<h3>NAS Servers for Self Hosting:</h3>
	<ul>
		<li>
			<ExternalLink
				textData={{ text: "Synology NAS", showIcon: true, location: "left" }}
				linkData={{ href: "https://synology.com/", ariaLabel: "Synology NAS" }}
			/>
			: An easy, not cheap, local solution for Google Services like Drive, Photos,
			Calendar, other services using Docker, etc. (Yes I should use <ExternalLink
				textData={{
					text: "NextCloud Local Hosting Service",
					showIcon: true,
					location: "left",
				}}
				linkData={{
					href: "https://nextcloud.com/",
					ariaLabel: "NextCloud Local Hosting Service",
				}}
			/>...maybe eventually)
		</li>
		<li>
			Custom NAS Server used as a <ExternalLink
				textData={{ text: "Plex Machine", showIcon: true, location: "left" }}
				linkData={{ href: "https://www.plex.tv/", ariaLabel: "Plex" }}
			/>
		</li>
	</ul>
</div>

<style lang="postcss">
	div {
		margin-bottom: 2rem;
	}
	p {
		margin-bottom: 1rem;
	}
	ul {
		list-style-type: square;
		padding-inline-start: 4rem;
	}
</style>
