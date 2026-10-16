<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteProgressBarElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteProgressBarElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import { slotAttribute } from "../lib/slotAttribute.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, valueLabel, ...props }: FlowRemoteProps<RemoteProgressBarElementProps, "valueLabel"> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-progress-bar", name: "ProgressBar", element: RemoteProgressBarElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined ||
      valueLabel !== undefined,
  );
</script>

{#if hasContent}<flr-progress-bar bind:this={element.node}>{@render children?.()}{#if valueLabel}<flr-slot-root-wrapper use:slotAttribute={"valueLabel"}>{@render valueLabel()}</flr-slot-root-wrapper>{/if}</flr-progress-bar>{:else}<flr-progress-bar bind:this={element.node}></flr-progress-bar>{/if}
