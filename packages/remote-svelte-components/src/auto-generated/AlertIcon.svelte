<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteAlertIconElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteAlertIconElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteAlertIconElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-alert-icon", name: "AlertIcon", element: RemoteAlertIconElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-alert-icon bind:this={element.node}>{@render children?.()}</flr-alert-icon>{:else}<flr-alert-icon bind:this={element.node}></flr-alert-icon>{/if}
