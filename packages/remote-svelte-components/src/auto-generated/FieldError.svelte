<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteFieldErrorElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteFieldErrorElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteFieldErrorElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-field-error", name: "FieldError", element: RemoteFieldErrorElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-field-error bind:this={element.node}>{@render children?.()}</flr-field-error>{:else}<flr-field-error bind:this={element.node}></flr-field-error>{/if}
