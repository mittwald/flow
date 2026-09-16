<script>
  import {
    Button,
    Heading,
    Link,
    MenuItem,
    Section,
  } from "@mittwald/flow-remote-svelte-components";
  import { useDemoNavigation } from "../_app/navigation.js";
  import MStudioSlot from "./lib/MStudioSlot.svelte";

  const navigate = useDemoNavigation();
</script>

<MStudioSlot id="@mstudio-ext/title">Battle station</MStudioSlot>
<MStudioSlot id="@mstudio-ext/actions">
  <MenuItem onAction={() => console.log("Rename station")}>Rename</MenuItem>
  <MenuItem onAction={() => console.log("Decommission station")}>Decommission</MenuItem>
</MStudioSlot>
<MStudioSlot id="@mstudio-ext/breadcrumb">
  <Link href="/remote-svelte/navigation/subpage">Battle station</Link>
</MStudioSlot>
<Section>
  <Heading>Death Star</Heading>
  <Button onPress={() => navigate("navigation")}>Back to fleet</Button>
</Section>
