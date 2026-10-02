<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteContextualHelpElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteContextualHelpElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteContextualHelpElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-contextual-help", name: "ContextualHelp", element: RemoteContextualHelpElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-contextual-help bind:this={element.node}>{@render children?.()}</flr-contextual-help>{:else}<flr-contextual-help bind:this={element.node}></flr-contextual-help>{/if}
