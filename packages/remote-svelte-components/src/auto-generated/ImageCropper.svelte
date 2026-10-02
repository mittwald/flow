<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteImageCropperElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteImageCropperElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import { slotAttribute } from "../lib/slotAttribute.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, errorView, ...props }: FlowRemoteProps<RemoteImageCropperElementProps, "errorView"> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-image-cropper", name: "ImageCropper", element: RemoteImageCropperElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined ||
      errorView !== undefined,
  );
</script>

{#if hasContent}<flr-image-cropper bind:this={element.node}>{@render children?.()}{#if errorView}<flr-slot-root-wrapper use:slotAttribute={"errorView"}>{@render errorView()}</flr-slot-root-wrapper>{/if}</flr-image-cropper>{:else}<flr-image-cropper bind:this={element.node}></flr-image-cropper>{/if}
