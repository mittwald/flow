<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteRadioButtonElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteRadioButtonElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteRadioButtonElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-radio-button", name: "RadioButton", element: RemoteRadioButtonElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-radio-button bind:this={element.node}>{@render children?.()}</flr-radio-button>{:else}<flr-radio-button bind:this={element.node}></flr-radio-button>{/if}
