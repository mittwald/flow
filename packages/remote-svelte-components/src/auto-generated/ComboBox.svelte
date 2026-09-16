<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteComboBoxElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteComboBoxElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteComboBoxElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-combo-box", name: "ComboBox", element: RemoteComboBoxElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-combo-box bind:this={element.node}>{@render children?.()}</flr-combo-box>{:else}<flr-combo-box bind:this={element.node}></flr-combo-box>{/if}
