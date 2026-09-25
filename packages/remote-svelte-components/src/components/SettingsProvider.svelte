<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    localStorageBackend,
    setSettingsStore,
    type SettingsBackend,
  } from "./settings.svelte.js";

  /**
   * Remembers a component's settings across reloads.
   *
   * Flow's `SettingsProvider` is a hierarchy of MobX stores with async
   * resources and Suspense-aware writes, built for `List`'s view settings. This
   * rebuild keeps what an extension uses — a named value that persists — and
   * stores it synchronously.
   */
  interface Props {
    /** Namespaces the stored keys, so two apps do not collide. @default "flow" */
    prefix?: string;
    /** Where settings are stored. Defaults to `localStorage`. */
    backend?: SettingsBackend;
    children?: Snippet;
  }

  const {
    prefix = "flow",
    backend = localStorageBackend,
    children,
  }: Props = $props();

  // The store is set once, while the component initializes — by design.
  // svelte-ignore state_referenced_locally
  setSettingsStore({ backend, prefix });
</script>

{@render children?.()}
