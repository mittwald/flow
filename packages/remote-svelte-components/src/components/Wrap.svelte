<script lang="ts">
  import type { Snippet } from "svelte";

  /**
   * Renders its children inside `with` when `if` holds, and bare otherwise — a
   * wrapper you can switch off without branching the tree around it.
   *
   * Vue's and React's versions take the wrapper as a child and reach into it.
   * Svelte has no way to look inside a snippet, so the wrapper is passed as one
   * that receives the content — which also states the nesting explicitly.
   *
   * ```svelte
   * <Wrap if={isLink} with={link}>Squadron</Wrap>
   * {#snippet link(content)}
   *   <Link href="/squadron">{@render content()}</Link>
   * {/snippet}
   * ```
   */
  interface Props {
    /** Whether the wrapper is rendered. */
    if: unknown;
    /** The wrapper, rendered around the content it is handed. */
    with?: Snippet<[Snippet]>;
    children?: Snippet;
  }

  const { if: condition, with: wrapper, children }: Props = $props();
</script>

{#if condition && wrapper && children}{@render wrapper(children)}{:else}{@render children?.()}{/if}
