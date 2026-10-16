<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteRadioElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteRadioElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteRadioElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-radio", name: "Radio", element: RemoteRadioElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-radio bind:this={element.node}>{@render children?.()}</flr-radio>{:else}<flr-radio bind:this={element.node}></flr-radio>{/if}
