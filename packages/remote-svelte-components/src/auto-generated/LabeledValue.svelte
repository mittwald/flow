<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteLabeledValueElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteLabeledValueElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteLabeledValueElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-labeled-value", name: "LabeledValue", element: RemoteLabeledValueElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-labeled-value bind:this={element.node}>{@render children?.()}</flr-labeled-value>{:else}<flr-labeled-value bind:this={element.node}></flr-labeled-value>{/if}
