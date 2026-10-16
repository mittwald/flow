<script lang="ts" module>
  export type ModalSize = "s" | "m" | "l";

  /*
   * Flow's `Modal` is a React composition, not a remote element: it renders an
   * `OverlayContent` and configures the components inside it through a props
   * context — the header, the content padding, the footer spacing. Both halves
   * are rebuilt here, so a Svelte app writes `Modal` and not the overlay
   * plumbing.
   *
   * The class names are Flow's own, generated from `Modal.module.scss`. They
   * are internal, and repeating them is the price of a composition that lives
   * in React: the alternative — marking `Modal` `@flr-generate`, so the host
   * materializes the whole thing from one element — would make this file
   * unnecessary.
   */
  const styles = {
    overlay: "flow--overlay",
    modal: "flow--modal",
    offCanvas: "flow--modal--off-canvas",
    left: "flow--modal--left",
    size: (size: ModalSize) => `flow--modal--size-${size}`,
    header: "flow--modal--header",
    content: "flow--modal--content",
    actionGroup: "flow--modal--action-group",
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
    /** The size of the modal. @default "s" */
    size?: ModalSize;
    /** Whether the modal is displayed as an off canvas. */
    offCanvas?: boolean;
    /** Which side the off canvas comes from. @default "right" */
    offCanvasOrientation?: "left" | "right";
    /** Whether a click outside closes the modal. @default true */
    isDismissable?: boolean;
    /** A controller to open and close the modal from anywhere. */
    controller?: OverlayController;
    class?: string;
    children?: Snippet;
  }

  const {
    size = "s",
    offCanvas = false,
    offCanvasOrientation = "right",
    isDismissable = true,
    controller: givenController,
    class: className,
    children,
  }: Props = $props();

  /*
   * Three ways to own the state, in Flow's order of precedence: a controller
   * the app passes, the controller of a surrounding trigger, or one of its own.
   */
  // svelte-ignore state_referenced_locally
  const controller =
    givenController ??
    getSurroundingOverlayController() ??
    createOverlayController();

  // So an `Action closeModal` inside finds it.
  setOverlayController(controller);

  const overlayClassName = $derived(
    [
      styles.overlay,
      offCanvas ? styles.offCanvas : styles.modal,
      styles.size(size),
      offCanvas && offCanvasOrientation === "left" ? styles.left : undefined,
      className,
    ]
      .filter(Boolean)
      .join(" "),
  );

  const propsContext = {
    Heading: { class: styles.header, level: 2 },
    Content: { class: styles.content },
    ActionGroup: { class: styles.actionGroup, spacing: "m" },
  };
</script>

<OverlayContent
  class={overlayClassName}
  isOpen={controller.isOpen}
  {isDismissable}
  onOpenChange={controller.setOpen}
>
  <PropsContextProvider props={propsContext}>
    {@render children?.()}
  </PropsContextProvider>
</OverlayContent>
