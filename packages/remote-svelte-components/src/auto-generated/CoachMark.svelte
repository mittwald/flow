<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteCoachMarkElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteCoachMarkElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteCoachMarkElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-coach-mark", name: "CoachMark", element: RemoteCoachMarkElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-coach-mark bind:this={element.node}>{@render children?.()}</flr-coach-mark>{:else}<flr-coach-mark bind:this={element.node}></flr-coach-mark>{/if}
