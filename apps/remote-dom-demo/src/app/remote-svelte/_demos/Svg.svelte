<script>
  import {
    AlertIcon,
    Heading,
    Icon,
    Section,
  } from "@mittwald/flow-remote-svelte-components";
  import { iconCircleCheck } from "./lib/icons.js";
  import PlainSvg from "./lib/PlainSvg.svelte";
  import TablerIcon from "./lib/TablerIcon.svelte";
</script>

<!--
  The React page renders a Flow icon, a Tabler icon and a raw `<svg>`. Flow's
  icon sets are React components, so the Tabler one is drawn from its paths
  instead. That an `<svg>` survives the boundary at all is the point: it travels
  as remote DOM, not as a prop.
-->
<Section>
  <Heading level={4}>Icon component</Heading>
  <AlertIcon status="success" />

  <Heading level={4}>Tabler icon</Heading>
  <Icon><TablerIcon paths={iconCircleCheck} /></Icon>

  <Heading level={4}>SVG element</Heading>
  <Icon><PlainSvg /></Icon>
</Section>
