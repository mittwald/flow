<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteAccentBoxElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteAccentBoxElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteAccentBoxElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-accent-box", name: "AccentBox", element: RemoteAccentBoxElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-accent-box bind:this={element.node}>{@render children?.()}</flr-accent-box>{:else}<flr-accent-box bind:this={element.node}></flr-accent-box>{/if}
