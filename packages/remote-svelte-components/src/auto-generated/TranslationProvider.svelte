<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteTranslationProviderElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteTranslationProviderElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteTranslationProviderElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-translation-provider", name: "TranslationProvider", element: RemoteTranslationProviderElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-translation-provider bind:this={element.node}>{@render children?.()}</flr-translation-provider>{:else}<flr-translation-provider bind:this={element.node}></flr-translation-provider>{/if}
