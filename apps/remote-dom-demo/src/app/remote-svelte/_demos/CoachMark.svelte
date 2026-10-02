<script>
  import {
    Action,
    Button,
    CoachMark,
    Heading,
    Section,
    Text,
  } from "@mittwald/flow-remote-svelte-components";

  /*
   * The anchor is given by id, not by ref: a ref never reaches the host, an id
   * does. The host looks the element up once the coach mark opens.
   */
  const paragraphs = Array.from({ length: 12 }, (_, index) => index);
</script>

<Section>
  <Heading>Battle station controls</Heading>

  <Button id="coach-mark-anchor">Arm the superlaser</Button>

  <CoachMark anchor="coach-mark-anchor" isDefaultOpen>
    <Heading>New: arm it from here</Heading>
    <Text>
      Arming the superlaser no longer takes a trip to the reactor control room.
      Scroll the page — this hint stays with its button.
    </Text>
    <Action closeOverlay="CoachMark">
      <Button>Got it</Button>
    </Action>
  </CoachMark>

  {#each paragraphs as paragraph (paragraph)}
    <Text>
      A long time ago in a galaxy far, far away, the Rebel Alliance struck a
      decisive blow against the Galactic Empire. Rebel spies managed to steal
      secret plans to the Empire&apos;s ultimate weapon, the Death Star, an
      armored space station with enough power to destroy an entire planet.
    </Text>
  {/each}
</Section>
