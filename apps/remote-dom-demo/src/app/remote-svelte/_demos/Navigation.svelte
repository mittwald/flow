<script>
  import { Button, Heading, Section } from "@mittwald/flow-remote-svelte-components";
  import { useDemoNavigation } from "../_app/navigation.js";
  import MStudioSlot from "./lib/MStudioSlot.svelte";

  const navigate = useDemoNavigation();
</script>

<MStudioSlot id="@mstudio-ext/title">Fleet</MStudioSlot>
<Section>
  <Heading>Fleet</Heading>
  <Button onPress={() => navigate("navigation/subpage")}>Open Death Star</Button>
</Section>
