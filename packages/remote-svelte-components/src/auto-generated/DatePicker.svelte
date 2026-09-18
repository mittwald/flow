<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteDatePickerElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteDatePickerElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteDatePickerElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-date-picker", name: "DatePicker", element: RemoteDatePickerElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-date-picker bind:this={element.node}>{@render children?.()}</flr-date-picker>{:else}<flr-date-picker bind:this={element.node}></flr-date-picker>{/if}
