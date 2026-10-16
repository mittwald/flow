<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteAlertBadgeElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteAlertBadgeElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteAlertBadgeElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-alert-badge", name: "AlertBadge", element: RemoteAlertBadgeElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-alert-badge bind:this={element.node}>{@render children?.()}</flr-alert-badge>{:else}<flr-alert-badge bind:this={element.node}></flr-alert-badge>{/if}
