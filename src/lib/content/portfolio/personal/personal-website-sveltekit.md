---
portfolioName: 'Personal Website'
portfolioSubHeading: 'My personal website re-written using SvelteKit.'
portfolioImage: 'Bradley_Shellnut_New_Site.png'
portfolioImageAlt: 'Home Page of bradleyshellnut.com'
---

<script>
    import ExternalLink from "$lib/components/ExternalLink.svelte";
</script>

{portfolioSubHeading}

Tech Stack:

- <ExternalLink linkData={{ href: "https://kit.svelte.dev/", ariaLabel: "SvelteKit" }} textData={{ text: "SvelteKit", showIcon: true, location: "left" }} />
- <ExternalLink linkData={{ href: "https://bits-ui.com/", ariaLabel: "Bits-UI" }} textData={{ text: "Bits-UI", showIcon: true, location: "left" }} /> for the headless-ui components.
- <ExternalLink linkData={{ href: "https://www.typescriptlang.org/", ariaLabel: "TypeScript" }} textData={{ text: "TypeScript", showIcon: true, location: "left" }} />
- <ExternalLink linkData={{ href: "https://www.typescriptlang.org/", ariaLabel: "TypeScript" }} textData={{ text: "TypeScript", showIcon: true, location: "left" }} />
- Deployed on a Coolify Self Hosted Box
- Icons in the <a href="/about">/about</a> page and the Bee, Shell, and Nut icons are all made by
<ExternalLink linkData={{ href: "https://www.flaticon.com/authors/freepik", ariaLabel: "Freepik" }} textData={{ text: "Freepik", showIcon: true, location: "left" }} /> from <ExternalLink textData={{ text: "Flaticon", showIcon: true, location: "left" }} linkData={{ href: "https://www.flaticon.com/", ariaLabel: "Flaticon" }} />

The previous version of my website was written using React and Gatsby which you can view <ExternalLink linkData={{ href: "https://wonderful-austin-9f17d2.netlify.app/", ariaLabel: "React and Gatsby Personal Site version" }} textData={{ text: "here.", showIcon: true, location: "left" }} />.

Each iteration brings better code and my previous React version was improved after the suggestions on
<ExternalLink linkData={{ href: "https://syntax.fm/show/444/syntax-highlight#t=33:19", ariaLabel: "Syntax.fm Podcast Number 444" }} textData={{ text: "Show 444", showIcon: true, location: "left" }} /> of the
<ExternalLink linkData={{ href: "https://syntax.fm/", ariaLabel: "Syntax.fm" }} textData={{ text: "Syntax Pocast.", showIcon: true, location: "left" }} />.

You can view the previous archived version of the site before those changes
<ExternalLink textData={{ text: "here.", showIcon: true, location: "left" }} linkData={{ href: "https://web.archive.org/web/20210224002046/https://bradleyshellnut.com/", ariaLabel: "Archive before Syntax Podcast" }} />.