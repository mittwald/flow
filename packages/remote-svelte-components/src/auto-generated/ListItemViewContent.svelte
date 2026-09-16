<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
<script lang="ts">
  import type { RemoteListItemViewContentElementProps } from "@mittwald/flow-remote-elements";
  import { RemoteListItemViewContentElement } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";
  import { slotAttribute } from "../lib/slotAttribute.js";
  import type { FlowRemoteProps } from "../lib/types.js";

  let { children, avatar, bottom, button, checkbox, subTitle, title, ...props }: FlowRemoteProps<RemoteListItemViewContentElementProps, "avatar" | "bottom" | "button" | "checkbox" | "subTitle" | "title"> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "flr-list-item-view-content", name: "ListItemViewContent", element: RemoteListItemViewContentElement },
    () => props,
  );

  const hasContent = $derived(
    children !== undefined ||
      avatar !== undefined ||
      bottom !== undefined ||
      button !== undefined ||
      checkbox !== undefined ||
      subTitle !== undefined ||
      title !== undefined,
  );
</script>

{#if hasContent}<flr-list-item-view-content bind:this={element.node}>{@render children?.()}{#if avatar}<flr-slot-root-wrapper use:slotAttribute={"avatar"}>{@render avatar()}</flr-slot-root-wrapper>{/if}{#if bottom}<flr-slot-root-wrapper use:slotAttribute={"bottom"}>{@render bottom()}</flr-slot-root-wrapper>{/if}{#if button}<flr-slot-root-wrapper use:slotAttribute={"button"}>{@render button()}</flr-slot-root-wrapper>{/if}{#if checkbox}<flr-slot-root-wrapper use:slotAttribute={"checkbox"}>{@render checkbox()}</flr-slot-root-wrapper>{/if}{#if subTitle}<flr-slot-root-wrapper use:slotAttribute={"subTitle"}>{@render subTitle()}</flr-slot-root-wrapper>{/if}{#if title}<flr-slot-root-wrapper use:slotAttribute={"title"}>{@render title()}</flr-slot-root-wrapper>{/if}</flr-list-item-view-content>{:else}<flr-list-item-view-content bind:this={element.node}></flr-list-item-view-content>{/if}
