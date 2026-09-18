<script lang="ts">
  import type { Snippet } from "svelte";
  import { setIconSet, type IconSet } from "../lib/iconSet.js";

  /**
   * Replaces Flow's icons with the ones a set names, for everything below.
   *
   * The counterpart of React's `IconSetProvider`, which exists so mStudio can
   * swap the default (Tabler) set for the FontAwesome Pro one. There is no pro
   * set for Svelte — FontAwesome is licensed per consumer and has no binding
   * here — so what this is for is an app bringing its own icons.
   *
   * An icon the set does not name keeps Flow's. The replacement is rendered as
   * `Icon`'s child, so it inherits `size`, `color` and the classes the host
   * applies, exactly as the built-in `<svg>` does.
   */
  interface Props {
    set: IconSet;
    children?: Snippet;
  }

  const { set, children }: Props = $props();

  // A context is set once, while the component initializes — by design.
  // svelte-ignore state_referenced_locally
  setIconSet(set);
</script>

{@render children?.()}
