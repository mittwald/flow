<script lang="ts">
  import type { Snippet } from "svelte";
  import Action from "./Action.svelte";

  /**
   * Groups actions so they report their state together.
   *
   * Flow's version wraps its children in an `Action` without an action of its
   * own, and so does this one — the grouping is the point.
   */
  interface Props {
    children?: Snippet;
  }

  const { children }: Props = $props();
</script>

<Action>
  {@render children?.()}
</Action>
