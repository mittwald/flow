<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteXAxisElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteXAxisElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteXAxisElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-x-axis", name: "XAxis", element: RemoteXAxisElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-x-axis bind:this={element.node}>{@render children?.()}</flr-x-axis>{:else}<flr-x-axis bind:this={element.node}></flr-x-axis>{/if}
