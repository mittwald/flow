<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTimeFieldElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTimeFieldElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTimeFieldElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-time-field", name: "TimeField", element: RemoteTimeFieldElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-time-field bind:this={element.node}>{@render children?.()}</flr-time-field>{:else}<flr-time-field bind:this={element.node}></flr-time-field>{/if}
