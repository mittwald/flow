<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteDialogTriggerElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteDialogTriggerElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteDialogTriggerElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-dialog-trigger", name: "DialogTrigger", element: RemoteDialogTriggerElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-dialog-trigger bind:this={element.node}>{@render children?.()}</flr-dialog-trigger>{:else}<flr-dialog-trigger bind:this={element.node}></flr-dialog-trigger>{/if}
