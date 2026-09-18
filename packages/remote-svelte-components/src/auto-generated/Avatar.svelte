<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteAvatarElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteAvatarElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteAvatarElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-avatar", name: "Avatar", element: RemoteAvatarElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-avatar bind:this={element.node}>{@render children?.()}</flr-avatar>{:else}<flr-avatar bind:this={element.node}></flr-avatar>{/if}
