<script lang="ts">
  import * as components from "../../../auto-generated/index.js";
  import type { ScenarioNode } from "./scenarios.js";
  import Self from "./Render.svelte";

  /** Builds a scenario with this package's generated components. */
  const { node }: { node: ScenarioNode } = $props();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // svelte-ignore state_referenced_locally
  const Component = (components as Record<string, any>)[node.component];

  const children = $derived(node.children ?? []);
</script>

<Component {...node.props ?? {}}>{#each children as child, index (index)}{#if typeof child === "string"}{child}{:else}<Self
        node={child}
      />{/if}{/each}</Component>
