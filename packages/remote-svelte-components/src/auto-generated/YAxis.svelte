<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteYAxisElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteYAxisElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteYAxisElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-y-axis", name: "YAxis", element: RemoteYAxisElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-y-axis bind:this={element.node}>{@render children?.()}</flr-y-axis>{:else}<flr-y-axis bind:this={element.node}></flr-y-axis>{/if}
