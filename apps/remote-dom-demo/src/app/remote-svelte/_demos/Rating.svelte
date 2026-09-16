<script>
  import {
    Flex,
    Heading,
    Icon,
    Label,
    Rating,
    RatingSegment,
  } from "@mittwald/flow-remote-svelte-components";
  import { iconMoodEmpty, iconMoodHappy, iconMoodSad } from "./lib/icons.js";
  import TablerIcon from "./lib/TablerIcon.svelte";
</script>

<!--
  `iconEmpty` and `iconFilled` are `ReactNode` props on the Flow component, so
  the generator made them slots — which is what lets a whole subtree cross the
  boundary. As remote properties they would be dropped by structured clone.
-->
{#snippet segment(label, color, paths)}
  <RatingSegment aria-label={label}>
    {#snippet iconEmpty()}<Icon><TablerIcon {paths} /></Icon>{/snippet}
    {#snippet iconFilled()}<Icon {color}><TablerIcon {paths} /></Icon>{/snippet}
  </RatingSegment>
{/snippet}

<Flex direction="column" gap="l">
  <Heading>Default</Heading>
  <Rating defaultValue={2}><Label>Cantina rating</Label></Rating>

  <Heading>Segments with single fill</Heading>
  <Rating fill="single" defaultValue={2}>
    <Label>How was your meal at the cantina?</Label>
    {@render segment("Terrible", "danger", iconMoodSad)}
    {@render segment("Okay", "warning", iconMoodEmpty)}
    {@render segment("Great", "success", iconMoodHappy)}
  </Rating>
</Flex>
