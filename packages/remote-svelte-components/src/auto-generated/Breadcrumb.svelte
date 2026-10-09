<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteBreadcrumbElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteBreadcrumbElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteBreadcrumbElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-breadcrumb", name: "Breadcrumb", element: RemoteBreadcrumbElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-breadcrumb bind:this={element.node}>{@render children?.()}</flr-breadcrumb>{:else}<flr-breadcrumb bind:this={element.node}></flr-breadcrumb>{/if}
