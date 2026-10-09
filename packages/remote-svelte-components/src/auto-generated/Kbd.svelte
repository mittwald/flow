<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteKbdElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteKbdElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteKbdElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-kbd", name: "Kbd", element: RemoteKbdElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-kbd bind:this={element.node}>{@render children?.()}</flr-kbd>{:else}<flr-kbd bind:this={element.node}></flr-kbd>{/if}
