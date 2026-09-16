<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteClearPropsContextElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteClearPropsContextElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteClearPropsContextElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-clear-props-context", name: "ClearPropsContext", element: RemoteClearPropsContextElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-clear-props-context bind:this={element.node}>{@render children?.()}</flr-clear-props-context>{:else}<flr-clear-props-context bind:this={element.node}></flr-clear-props-context>{/if}
