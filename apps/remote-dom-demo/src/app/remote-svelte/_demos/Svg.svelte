<script>
  import {
    AlertIcon,
    Heading,
    Icon,
    IconCheck,
    Section,
  } from "@mittwald/flow-remote-svelte-components";
  import PlainSvg from "./lib/PlainSvg.svelte";
</script>

<!--
  A Flow icon from the generated Svelte set, and a raw `<svg>` inside `Icon`.
  The second is the path for an icon Flow does not ship — it travels as remote
  DOM, not as a prop, which is what makes it work at all.
-->
<Section>
  <Heading level={4}>Icon component</Heading>
  <AlertIcon status="success" />

  <Heading level={4}>Flow icon from the Svelte set</Heading>
  <IconCheck />

  <Heading level={4}>SVG element</Heading>
  <Icon><PlainSvg /></Icon>
</Section>
