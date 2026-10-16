<script lang="ts" module>
  /* Flow's own class names — see the note in Modal.svelte. */
  const styles = {
    overlay: "flow--overlay",
    lightBox: "flow--light-box",
    fitScreen: "flow--light-box--fit-screen",
    content: "flow--light-box--content",
    actionGroup: "flow--light-box--action-group",
  };
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import OverlayContent from "../auto-generated/OverlayContent.svelte";
  import PropsContextProvider from "../lib/PropsContextProvider.svelte";
  import {
    createOverlayController,
    getSurroundingOverlayController,
    setOverlayController,
    type OverlayController,
  } from "./overlayController.svelte.js";

  interface Props {
    /** Whether content may exceed the available screen space. @default true */
    fitScreen?: boolean;
    /** A controller to open and close the light box from anywhere. */
    controller?: OverlayController;
    class?: string;
    children?: Snippet;
  }

  const {
    fitScreen = true,
    controller: givenController,
    class: className,
    children,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  const controller =
    givenController ??
    getSurroundingOverlayController() ??
    createOverlayController();

  setOverlayController(controller);

  const overlayClassName = $derived(
    [
      styles.overlay,
      styles.lightBox,
      fitScreen ? styles.fitScreen : undefined,
      className,
    ]
      .filter(Boolean)
      .join(" "),
  );

  const propsContext = {
    Content: { class: styles.content },
    ActionGroup: {
      class: styles.actionGroup,
      spacing: "m",
      preserveOrder: true,
    },
  };
</script>

<OverlayContent
  class={overlayClassName}
  isOpen={controller.isOpen}
  isDismissable={true}
  onOpenChange={controller.setOpen}
>
  <PropsContextProvider props={propsContext}>
    {@render children?.()}
  </PropsContextProvider>
</OverlayContent>
