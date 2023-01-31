<script lang="ts">
	import SEO from "$root/lib/components/SEO.svelte";
</script>

<SEO title="Privacy Blog" />

<div>
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
			For the sake of transparency I am using{' '}
			<a
				target="_blank"
				aria-label="Umami Analytics FAQ"
				href="https://umami.is/docs/faq"
				rel="noreferrer"
			>
				Umami Analytics
			</a>{' '}
			to anonymously track visits to my site. You can completely block this
			if you want by either using an AdBlocker like{' '}
			<a
				target="_blank"
				aria-label="uBlock Origin"
				href="https://ublockorigin.com/"
				rel="noreferrer"
			>
				uBlock Origin
			</a>{' '}
			and/or set your browser to send "Do Not Track" requests as I honor
			them.
		</p>
	</div>
	<div style="margin-top: 2.5rem;">
		<h2>Useful Resources</h2>
		<p>
			Here are a few sites/lists of privacy oriented software for you to
			check out:
		</p>
		<ul>
			<li>
				<a
					target="_blank"
					aria-label="Privacy Respecting Software"
					href="https://github.com/Lissy93/personal-security-checklist/blob/master/5_Privacy_Respecting_Software.md"
					rel="noreferrer"
				>
					Privacy Respecting Software
				</a>
			</li>
			<li>
				<a
					target="_blank"
					aria-label="Privacy Guides"
					href="https://www.privacyguides.org/"
					rel="noreferrer"
				>
					Privacy Guides
				</a>
			</li>
			<li>
				<a
					target="_blank"
					aria-label="Ethical Alternatives"
					href="https://ethical.net/resources/"
					rel="noreferrer"
				>
					Ethical Alternatives
				</a>
			</li>
		</ul>
	</div>
	<div>
		<h3>Privacy Centric Paid Services I use:</h3>
		<ul>
			<li>
				Article Saving:{' '}
				<a
					target="_blank"
					aria-label="Wallabag Article Saver"
					href="https://github.com/wallabag/wallabag"
					rel="noreferrer"
				>
					Wallabag
				</a>
			</li>
			<li>
				Anonymous Email Forwarding:{' '}
				<a
					target="_blank"
					aria-label="AnonAddy Email Forwarding"
					href="https://anonaddy.com/"
					rel="noreferrer"
				>
					AnonAddy
				</a>
			</li>
			<li>
				Email:{' '}
				<a
					target="_blank"
					aria-label="ProtonMail"
					href="https://protonmail.com"
					rel="noreferrer"
				>
					ProtonMail
				</a>
			</li>
			<li>
				Notes:{' '}
				<a
					target="_blank"
					aria-label="Standard Notes"
					href="https://standardnotes.org/"
					rel="noreferrer"
				>
					Standard Notes
				</a>
			</li>
			<li>
				VPN:{' '}
				<a
					target="_blank"
					aria-label="Mullvad VPN"
					href="https://mullvad.net/en/"
					rel="noreferrer"
				>
					Mullvad VPN
				</a>
			</li>
		</ul>
	</div>
	<div>
		<h3>NAS Servers for Self Hosting:</h3>
		<ul>
			<li>
				<a
					target="_blank"
					aria-label="Synology NAS"
					href="https://synology.com/"
					rel="noreferrer"
				>
					Synology
				</a>
				: An easy, not cheap, local solution for Google Services like Drive,
				Drive, Photos, Calendar, other services using Docker, etc. (Yes I
				should use{' '}
				<a
					target="_blank"
					aria-label="NextCloud Local Hosting Service"
					href="https://nextcloud.com/"
					rel="noreferrer"
				>
					NextCloud
				</a>
				...maybe eventually)
			</li>
			<li>
				Mac Mini: Used as a{' '}
				<a
					target="_blank"
					aria-label="Plex"
					href="https://www.plex.tv/"
					rel="noreferrer"
				>
					Plex Server
				</a>{' '}
				for my Movies/TV/Music until I build a dedicated NAS and maybe
				switch to{' '}
				<a
					target="_blank"
					aria-label="JellyFin"
					href="https://jellyfin.org/"
					rel="noreferrer"
				>
					JellyFin
				</a>{' '}
				once it is more mature.
			</li>
		</ul>
	</div>
	<div>
		<h3>Software Deployed:</h3>
		<ul>
			<li>
				<a
					target="_blank"
					aria-label="Traefik Cloud Proxy"
					href="https://github.com/traefik/traefik"
					rel="noreferrer"
				>
					Traefik
				</a>
				: A HTTP reverse proxy and load balancer.
			</li>
			<li>
				<a
					target="_blank"
					aria-label="Syncthing File Synchronization"
					href="https://github.com/syncthing/syncthing"
					rel="noreferrer"
				>
					Syncthing
				</a>
				: An open source file synchronization program.
			</li>
		</ul>
	</div>
</div>

<style lang="postcss">
</style>