<script>
  import {
    AlertIcon,
    Heading,
    Icon,
    Section,
  } from "@mittwald/flow-remote-svelte-components";
  import { iconApp } from "./lib/icons.js";
  import PlainSvg from "./lib/PlainSvg.svelte";
  import TablerIcon from "./lib/TablerIcon.svelte";
</script>

<!--
  The React page renders a Flow icon, a Tabler icon and a raw `<svg>`. Only the
  third has a Svelte equivalent — Flow's icon sets are React components — so the
  other two are drawn as SVG too. That an `<svg>` survives the boundary at all is
  the point: it travels as remote DOM, not as a prop.
-->
<Section>
  <Heading level={4}>AlertIcon (a remote component)</Heading>
  <AlertIcon status="success" />

  <Heading level={4}>An icon path, inside Icon</Heading>
  <Icon><TablerIcon paths={iconApp} /></Icon>

  <Heading level={4}>A plain SVG element</Heading>
  <Icon><PlainSvg /></Icon>
</Section>
