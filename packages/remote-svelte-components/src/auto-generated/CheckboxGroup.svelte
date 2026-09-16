<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteCheckboxGroupElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteCheckboxGroupElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteCheckboxGroupElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-checkbox-group", name: "CheckboxGroup", element: RemoteCheckboxGroupElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-checkbox-group bind:this={element.node}>{@render children?.()}</flr-checkbox-group>{:else}<flr-checkbox-group bind:this={element.node}></flr-checkbox-group>{/if}
