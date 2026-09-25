<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTabsElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTabsElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import { slotAttribute } from "../lib/slotAttribute.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, tabNotFoundView, ...props }: FlowRemoteProps<RemoteTabsElementProps, "tabNotFoundView"> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-tabs", name: "Tabs", element: RemoteTabsElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined ||
      tabNotFoundView !== undefined,
  );
</script>

{#if hasContent}<flr-tabs bind:this={element.node}>{@render children?.()}{#if tabNotFoundView}<flr-slot-root-wrapper use:slotAttribute={"tabNotFoundView"}>{@render tabNotFoundView()}</flr-slot-root-wrapper>{/if}</flr-tabs>{:else}<flr-tabs bind:this={element.node}></flr-tabs>{/if}
