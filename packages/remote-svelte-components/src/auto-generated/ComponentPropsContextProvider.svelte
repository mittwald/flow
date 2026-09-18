<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteComponentPropsContextProviderElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteComponentPropsContextProviderElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteComponentPropsContextProviderElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-component-props-context-provider", name: "ComponentPropsContextProvider", element: RemoteComponentPropsContextProviderElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-component-props-context-provider bind:this={element.node}>{@render children?.()}</flr-component-props-context-provider>{:else}<flr-component-props-context-provider bind:this={element.node}></flr-component-props-context-provider>{/if}
