<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteNotificationElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteNotificationElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteNotificationElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-notification", name: "Notification", element: RemoteNotificationElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-notification bind:this={element.node}>{@render children?.()}</flr-notification>{:else}<flr-notification bind:this={element.node}></flr-notification>{/if}
