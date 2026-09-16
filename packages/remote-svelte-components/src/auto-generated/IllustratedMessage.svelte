<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteIllustratedMessageElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteIllustratedMessageElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteIllustratedMessageElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-illustrated-message", name: "IllustratedMessage", element: RemoteIllustratedMessageElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-illustrated-message bind:this={element.node}>{@render children?.()}</flr-illustrated-message>{:else}<flr-illustrated-message bind:this={element.node}></flr-illustrated-message>{/if}
