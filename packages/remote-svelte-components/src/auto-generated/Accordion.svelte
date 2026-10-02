<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteAccordionElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteAccordionElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteAccordionElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-accordion", name: "Accordion", element: RemoteAccordionElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-accordion bind:this={element.node}>{@render children?.()}</flr-accordion>{:else}<flr-accordion bind:this={element.node}></flr-accordion>{/if}
