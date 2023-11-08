<script lang="ts">
	import ExternalLink from "$root/lib/components/ExternalLink.svelte";
// import SEO from "$root/lib/components/SEO.svelte";
</script>

<!-- <SEO title="Privacy Blog" /> -->

<div>
	<h1>Privacy</h1>
	<p>
		Long story short, I believe everyone should know who has your personal
		data, how it is being collected/stored, and what it is being used for.
	</p>
	<p>
		However, it is ultimately up to each person to determine how much data
		they are willing to give to any business/entity.
	</p>
	<p>
		For the sake of transparency I am using <ExternalLink ariaLabel="Umami Analytics FAQ" href="https://umami.is/docs/faq" showIcon>Umami Analytics</ExternalLink> to anonymously track visits to my site. You can completely block this if you want by either using an AdBlocker like
		<ExternalLink ariaLabel="uBlock Origin" href="https://ublockorigin.com/" showIcon>uBlock Origin</ExternalLink> or setting your browser to send "Do Not Track" requests as I honor them.
	</p>
</div>
<div>
	<h2>Useful Resources</h2>
	<p>
		Here are a few sites/lists of privacy oriented software for you to
		check out:
	</p>
	<ul>
		<li>
			<ExternalLink ariaLabel="Awesome Privacy" href="https://github.com/Lissy93/awesome-privacy" showIcon>Privacy Respecting Software List</ExternalLink>
		</li>
		<li>
			<ExternalLink ariaLabel="Privacy Guides" href="https://www.privacyguides.org/" showIcon>Privacy Guides</ExternalLink>
		</li>
		<li>
			<ExternalLink ariaLabel="Ethical Alternatives" href="https://ethical.net/resources/" showIcon>Ethical Alternatives</ExternalLink>
		</li>
	</ul>
</div>
<div>
	<h3>Privacy Centric Paid Services I use:</h3>
	<ul>
		<li>
			Article Saving: <ExternalLink ariaLabel="Wallabag Article Saver" href="https://wallabag.com/" showIcon>Wallabag</ExternalLink>
		</li>
		<li>
			Anonymous Email Forwarding:
			<ExternalLink ariaLabel="AnonAddy Email Forwarding" href="https://anonaddy.com/" showIcon>AnonAddy</ExternalLink>
		</li>
		<li>
			Email: <ExternalLink ariaLabel="ProtonMail" href="https://protonmail.com/" showIcon>ProtonMail</ExternalLink>
		</li>
		<li>
			Notes: <ExternalLink ariaLabel="Joplin" href="https://joplinapp.org/" showIcon>Joplin Notes</ExternalLink>
		</li>
		<li>
			VPN: <ExternalLink ariaLabel="Mullvad VPN" href="https://mullvad.net/" showIcon>Mullvad VPN</ExternalLink>
		</li>
	</ul>
</div>
<div>
	<h3>NAS Servers for Self Hosting:</h3>
	<ul>
		<li>
			<ExternalLink ariaLabel="Synology NAS" href="https://synology.com/" showIcon>Synology NAS</ExternalLink>: An easy, not cheap, local solution for Google Services like Drive, Photos, Calendar, other services using Docker, etc. (Yes I should use <ExternalLink ariaLabel="NextCloud Local Hosting Service" href="https://nextcloud.com/" showIcon>NextCloud Local Hosting Service</ExternalLink>...maybe eventually)
		</li>
		<li>
			Mac Mini: Used as a <ExternalLink ariaLabel="Plex" href="https://www.plex.tv/" showIcon>Plex Server</ExternalLink> for my Movies/TV/Music until I build a dedicated NAS and maybe switch to <ExternalLink ariaLabel="JellyFin" href="https://jellyfin.org/" showIcon>JellyFin</ExternalLink> soon.
		</li>
	</ul>
</div>
<div>
	<h3>Software Deployed:</h3>
	<ul>
		<li>
			<ExternalLink ariaLabel="Syncthing File Synchronization" href="https://github.com/syncthing/syncthing" showIcon>Syncthing</ExternalLink>: An open source file synchronization program.
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