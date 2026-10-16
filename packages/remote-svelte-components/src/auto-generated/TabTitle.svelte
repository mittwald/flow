<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTabTitleElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTabTitleElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTabTitleElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-tab-title", name: "TabTitle", element: RemoteTabTitleElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-tab-title bind:this={element.node}>{@render children?.()}</flr-tab-title>{:else}<flr-tab-title bind:this={element.node}></flr-tab-title>{/if}
