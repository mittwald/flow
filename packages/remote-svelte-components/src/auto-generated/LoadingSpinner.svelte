<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteLoadingSpinnerElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteLoadingSpinnerElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteLoadingSpinnerElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-loading-spinner", name: "LoadingSpinner", element: RemoteLoadingSpinnerElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-loading-spinner bind:this={element.node}>{@render children?.()}</flr-loading-spinner>{:else}<flr-loading-spinner bind:this={element.node}></flr-loading-spinner>{/if}
