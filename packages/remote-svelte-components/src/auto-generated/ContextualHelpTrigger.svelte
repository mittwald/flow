<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteContextualHelpTriggerElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteContextualHelpTriggerElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteContextualHelpTriggerElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-contextual-help-trigger", name: "ContextualHelpTrigger", element: RemoteContextualHelpTriggerElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-contextual-help-trigger bind:this={element.node}>{@render children?.()}</flr-contextual-help-trigger>{:else}<flr-contextual-help-trigger bind:this={element.node}></flr-contextual-help-trigger>{/if}
