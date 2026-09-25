<script lang="ts" module>
  /*
   * A void element cannot have children — and in Svelte "children" includes the
   * anchors a block or a component boundary leaves behind, which is what an
   * `<img>` in a scenario tripped over on the host ("img is a void element
   * tag"). So the empty case is rendered by a branch that contains nothing at
   * all.
   */
  const voidTags = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ]);
</script>

<script lang="ts">
  import type { ElementNode } from "./scenarioNode.js";
  import RemoteScenario from "./RemoteScenario.svelte";

  const { node }: { node: ElementNode } = $props();

  const isEmpty = $derived(
    node.children.length === 0 || voidTags.has(node.tag.toLowerCase()),
  );
</script>

{#if isEmpty}<svelte:element
    this={node.tag}
    {...node.attributes}
  />{:else}<svelte:element this={node.tag} {...node.attributes}><RemoteScenario
      nodes={node.children}
    /></svelte:element>{/if}
