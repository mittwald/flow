<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteCheckboxButtonElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteCheckboxButtonElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteCheckboxButtonElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-checkbox-button", name: "CheckboxButton", element: RemoteCheckboxButtonElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-checkbox-button bind:this={element.node}>{@render children?.()}</flr-checkbox-button>{:else}<flr-checkbox-button bind:this={element.node}></flr-checkbox-button>{/if}
