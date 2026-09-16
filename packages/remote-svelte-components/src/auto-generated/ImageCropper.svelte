<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteImageCropperElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteImageCropperElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, ...props }: FlowRemoteProps<RemoteImageCropperElementProps> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-image-cropper", name: "ImageCropper", element: RemoteImageCropperElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined,
  );
</script>

{#if hasContent}<flr-image-cropper bind:this={element.node}>{@render children?.()}</flr-image-cropper>{:else}<flr-image-cropper bind:this={element.node}></flr-image-cropper>{/if}
