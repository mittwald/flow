<script>
  import {
    CodeEditor,
    Heading,
    Label,
    Section,
  } from "@mittwald/flow-remote-svelte-components";

  let code = $state('console.log("May the Force be with you");\n');
</script>

<Section>
  <Heading>Flight computer</Heading>
  <CodeEditor language="javascript" value={code} onChange={(next) => (code = next)}>
    <Label>Autopilot routine</Label>
  </CodeEditor>
</Section>
