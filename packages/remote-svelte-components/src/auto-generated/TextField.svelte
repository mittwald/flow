<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTextFieldElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTextFieldElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTextFieldElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-text-field", name: "TextField", element: RemoteTextFieldElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-text-field bind:this={element.node}>{@render children?.()}</flr-text-field>{:else}<flr-text-field bind:this={element.node}></flr-text-field>{/if}
