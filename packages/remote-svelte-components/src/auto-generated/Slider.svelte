<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteSliderElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteSliderElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteSliderElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-slider", name: "Slider", element: RemoteSliderElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-slider bind:this={element.node}>{@render children?.()}</flr-slider>{:else}<flr-slider bind:this={element.node}></flr-slider>{/if}
