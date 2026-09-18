<script>
  import { TunnelEntry } from "@mittwald/flow-remote-svelte-components";

  /*
   * The Svelte counterpart of `@mittwald/mstudio-ext-react-components`, which is
   * one `TunnelEntry` each: the extension marks a subtree, the host renders it
   * in its own page header. There is no Svelte package for them yet.
   *
   * `id` is one of `@mstudio-ext/title`, `@mstudio-ext/actions` or
   * `@mstudio-ext/breadcrumb`.
   */
  const { id, children } = $props();
</script>

<TunnelEntry {id}>{@render children?.()}</TunnelEntry>
