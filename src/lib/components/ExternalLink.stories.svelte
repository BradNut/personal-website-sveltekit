<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import ExternalLink from "./ExternalLink.svelte";
  import { blueSkyIcon } from "../util/logoIcons.svelte";

  const { Story } = defineMeta({
    title: "Components/ExternalLink",
    component: ExternalLink,
    tags: ["autodocs"],
    args: {
      linkData: {
        href: "https://example.com",
        ariaLabel: "Go to example.com",
        title: "Example",
        target: "_blank",
        clazz: "hub-icon bluesky-contact",
      },
      textData: { text: "Visit Example", location: "left", showIcon: true },
      iconData: { type: "svg", icon: blueSkyIcon, iconClass: "center" },
    },
    argTypes: {
      linkData: { control: "object" },
      textData: { control: "object" },
      iconData: { control: "object" },
    },
  });
</script>

<Story name="Default" />
