<script lang="ts">
  import type { ScenarioNode } from "./scenarioNode.js";
  import ScenarioComponent from "./ScenarioComponent.svelte";
  import ScenarioElement from "./ScenarioElement.svelte";

  /** Renders a converted scenario. Compact on purpose — see `normalizeWhitespace.ts`. */
  const { nodes }: { nodes: ScenarioNode[] } = $props();
</script>

{#each nodes as node, index (index)}{#if node.kind === "text"}{node.text}{:else if node.kind === "element"}<ScenarioElement
      {node}
    />{:else}<ScenarioComponent {node} />{/if}{/each}
