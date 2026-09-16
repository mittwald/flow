<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteDateRangePickerElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteDateRangePickerElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteDateRangePickerElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-date-range-picker", name: "DateRangePicker", element: RemoteDateRangePickerElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-date-range-picker bind:this={element.node}>{@render children?.()}</flr-date-range-picker>{:else}<flr-date-range-picker bind:this={element.node}></flr-date-range-picker>{/if}
