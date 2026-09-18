<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteHeadingElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteHeadingElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteHeadingElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-heading", name: "Heading", element: RemoteHeadingElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-heading bind:this={element.node}>{@render children?.()}</flr-heading>{:else}<flr-heading bind:this={element.node}></flr-heading>{/if}
