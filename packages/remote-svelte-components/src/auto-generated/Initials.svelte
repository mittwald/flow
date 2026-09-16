<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteInitialsElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteInitialsElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteInitialsElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-initials", name: "Initials", element: RemoteInitialsElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-initials bind:this={element.node}>{@render children?.()}</flr-initials>{:else}<flr-initials bind:this={element.node}></flr-initials>{/if}
