<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteLightBoxGalleryElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteLightBoxGalleryElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteLightBoxGalleryElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-light-box-gallery", name: "LightBoxGallery", element: RemoteLightBoxGalleryElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-light-box-gallery bind:this={element.node}>{@render children?.()}</flr-light-box-gallery>{:else}<flr-light-box-gallery bind:this={element.node}></flr-light-box-gallery>{/if}
