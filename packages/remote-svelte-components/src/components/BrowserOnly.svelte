<script lang="ts">
  import { onMount, type Snippet } from "svelte";

  /**
   * Renders its children only once mounted.
   *
   * A remote app is client-only by nature, so this matters where the app itself
   * is server-rendered — a SvelteKit page hosting the remote root — and a
   * subtree must not be part of that render.
   */
  interface Props {
    children?: Snippet;
  }

  const { children }: Props = $props();

  let isMounted = $state(false);

  onMount(() => {
    isMounted = true;
  });
</script>

{#if isMounted}{@render children?.()}{/if}
