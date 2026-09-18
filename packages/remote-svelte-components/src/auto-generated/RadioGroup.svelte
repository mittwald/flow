<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteRadioGroupElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteRadioGroupElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteRadioGroupElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-radio-group", name: "RadioGroup", element: RemoteRadioGroupElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-radio-group bind:this={element.node}>{@render children?.()}</flr-radio-group>{:else}<flr-radio-group bind:this={element.node}></flr-radio-group>{/if}
