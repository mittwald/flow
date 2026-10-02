<script lang="ts">
  import { useRemoteConnection } from "../lib/remoteContext.svelte.js";

  /**
   * Tells the host the extension is still loading, so mStudio shows its own
   * loading state instead of an empty page.
   *
   * The React package calls this `LoadingFallbackTrigger` and re-exports it as
   * `LoadingIndicator` from `@mittwald/mstudio-ext-react-components`.
   */
  interface Props {
    show?: boolean;
  }

  const { show = true }: Props = $props();

  const connection = useRemoteConnection();

  /*
   * The cleanup is taken back on unmount as well as on every change: the host
   * has no way of telling a finished load from an extension that navigated
   * away, so an indicator that disappears without saying so leaves mStudio
   * loading forever.
   */
  $effect(() => {
    const currentConnection = connection.current;
    currentConnection?.imports.setIsLoading(show);

    return () => currentConnection?.imports.setIsLoading(false);
  });
</script>
