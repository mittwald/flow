<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteFieldDescriptionElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteFieldDescriptionElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteFieldDescriptionElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-field-description", name: "FieldDescription", element: RemoteFieldDescriptionElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-field-description bind:this={element.node}>{@render children?.()}</flr-field-description>{:else}<flr-field-description bind:this={element.node}></flr-field-description>{/if}
