<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteActionGroupElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteActionGroupElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteActionGroupElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-action-group", name: "ActionGroup", element: RemoteActionGroupElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-action-group bind:this={element.node}>{@render children?.()}</flr-action-group>{:else}<flr-action-group bind:this={element.node}></flr-action-group>{/if}
