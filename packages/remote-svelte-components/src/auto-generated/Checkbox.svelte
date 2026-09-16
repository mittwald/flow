<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteCheckboxElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteCheckboxElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteCheckboxElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-checkbox", name: "Checkbox", element: RemoteCheckboxElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-checkbox bind:this={element.node}>{@render children?.()}</flr-checkbox>{:else}<flr-checkbox bind:this={element.node}></flr-checkbox>{/if}
