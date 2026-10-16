<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteAvatarStackElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteAvatarStackElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteAvatarStackElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-avatar-stack", name: "AvatarStack", element: RemoteAvatarStackElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-avatar-stack bind:this={element.node}>{@render children?.()}</flr-avatar-stack>{:else}<flr-avatar-stack bind:this={element.node}></flr-avatar-stack>{/if}
