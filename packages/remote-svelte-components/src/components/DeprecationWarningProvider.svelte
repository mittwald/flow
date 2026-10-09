<script lang="ts">
  import type { Snippet } from "svelte";
  import {
    setDeprecationWarningHandler,
    type DeprecationWarningHandler,
  } from "../lib/deprecation.js";

  /**
   * Collects the deprecation warnings a remote app triggers.
   *
   * `RemoteRoot` installs one that forwards to the host, which is how mStudio
   * learns which deprecated paths an extension still uses.
   */
  interface Props {
    onWarning?: DeprecationWarningHandler;
    children?: Snippet;
  }

  const { onWarning, children }: Props = $props();

  setDeprecationWarningHandler((message) => onWarning?.(message));
</script>

{@render children?.()}
