<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemotePasswordCreationFieldElementProps } from "@mittwald/flow-remote-elements";
  import { RemotePasswordCreationFieldElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemotePasswordCreationFieldElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-password-creation-field", name: "PasswordCreationField", element: RemotePasswordCreationFieldElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-password-creation-field bind:this={element.node}>{@render children?.()}</flr-password-creation-field>{:else}<flr-password-creation-field bind:this={element.node}></flr-password-creation-field>{/if}
