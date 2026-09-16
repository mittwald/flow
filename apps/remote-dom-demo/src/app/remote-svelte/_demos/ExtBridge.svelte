<script>
  import { CodeBlock, Section } from "@mittwald/flow-remote-svelte-components";
  import { getConfig } from "@mittwald/ext-bridge/browser";

  /*
   * Ext-bridge itself is framework-agnostic — only its `useConfig` hook is
   * React. `getConfig()` is the same call without one.
   */
  let config = $state(undefined);

  $effect(() => {
    void getConfig().then((value) => (config = value));
  });
</script>

<Section>
  <CodeBlock code={JSON.stringify(config, undefined, 2)} />
</Section>
