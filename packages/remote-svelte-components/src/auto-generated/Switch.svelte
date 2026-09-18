<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteSwitchElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteSwitchElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteSwitchElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-switch", name: "Switch", element: RemoteSwitchElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-switch bind:this={element.node}>{@render children?.()}</flr-switch>{:else}<flr-switch bind:this={element.node}></flr-switch>{/if}
