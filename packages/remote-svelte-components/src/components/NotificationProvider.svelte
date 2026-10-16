<script lang="ts">
  import type { Snippet } from "svelte";
  import PropsContextProvider from "../lib/PropsContextProvider.svelte";
  import {
    NotificationController,
    setNotificationController,
    type NotificationEntry,
  } from "./notificationController.svelte.js";

  /**
   * Renders the app's notifications and hands its controller to everything
   * below.
   *
   * The container is not a separate element: the notifications are remote
   * `Notification` components, and the host's own container is what positions
   * them.
   */
  interface Props {
    children?: Snippet;
  }

  const { children }: Props = $props();

  const controller = new NotificationController();
  setNotificationController(controller);

  /*
   * The hover and focus handlers are what pauses `autoClose` while someone is
   * reading. They reach the `Notification` through the props context, because
   * the entry is a snippet — there is no element to hand them to directly.
   */
  const propsContextFor = (entry: NotificationEntry) => ({
    Notification: {
      onMouseEnter: () => controller.pauseAutoClose(entry),
      onMouseLeave: () => controller.resumeAutoClose(entry),
      onFocus: () => controller.pauseAutoClose(entry),
      onBlur: () => controller.resumeAutoClose(entry),
      onClose: () => {
        controller.remove(entry.id);
        entry.options.onClose?.();
      },
    },
  });
</script>

{#each controller.notifications as entry (entry.id)}<PropsContextProvider
    props={propsContextFor(entry)}
  >{@render entry.notification()}</PropsContextProvider>{/each}{@render children?.()}
