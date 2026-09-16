<script>
  import { Markdown, Section } from "@mittwald/flow-remote-svelte-components";

  const markdown = `
# Death Star

A **moon-sized** battle station with one *thermal exhaust port*.

- Superlaser
- Tractor beam
- [Blueprints](https://example.com)
`;
</script>

<Section>
  <Markdown>{markdown}</Markdown>
</Section>
