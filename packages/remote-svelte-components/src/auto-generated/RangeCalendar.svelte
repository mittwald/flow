<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteRangeCalendarElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteRangeCalendarElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteRangeCalendarElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-range-calendar", name: "RangeCalendar", element: RemoteRangeCalendarElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-range-calendar bind:this={element.node}>{@render children?.()}</flr-range-calendar>{:else}<flr-range-calendar bind:this={element.node}></flr-range-calendar>{/if}
