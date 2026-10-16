<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteLightBoxGalleryItemElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteLightBoxGalleryItemElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteLightBoxGalleryItemElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-light-box-gallery-item", name: "LightBoxGalleryItem", element: RemoteLightBoxGalleryItemElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-light-box-gallery-item bind:this={element.node}>{@render children?.()}</flr-light-box-gallery-item>{:else}<flr-light-box-gallery-item bind:this={element.node}></flr-light-box-gallery-item>{/if}
