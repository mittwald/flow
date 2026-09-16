<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteNumberFieldElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteNumberFieldElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteNumberFieldElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-number-field", name: "NumberField", element: RemoteNumberFieldElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-number-field bind:this={element.node}>{@render children?.()}</flr-number-field>{:else}<flr-number-field bind:this={element.node}></flr-number-field>{/if}
