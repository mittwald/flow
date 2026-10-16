<script lang="ts" module>
  /* Flow's own class names — see the note in Modal.svelte. */
  const styles = {
    popover: "flow--popover",
    content: "flow--popover--content",
  };
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import PopoverContent from "../auto-generated/PopoverContent.svelte";
  import PropsContextProvider from "../lib/PropsContextProvider.svelte";
  import {
    createOverlayController,
    getSurroundingOverlayController,
    setOverlayController,
    type OverlayController,
  } from "./overlayController.svelte.js";

  interface Props {
    /** Whether the popover shows a tip pointing at its trigger. */
    withTip?: boolean;
    /** Whether the popover holds a dialog. */
    isDialogContent?: boolean;
    /** A fixed width. */
    width?: string | number;
    /** A controller to open and close the popover from anywhere. */
    controller?: OverlayController;
    class?: string;
    children?: Snippet;
  }

  const {
    withTip = false,
    isDialogContent,
    width,
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

  const popoverClassName = $derived(
    [styles.popover, className].filter(Boolean).join(" "),
  );

  const propsContext = {
    Content: { class: styles.content },
  };
</script>

<PopoverContent
  class={popoverClassName}
  {withTip}
  {isDialogContent}
  {width}
  isOpen={controller.isOpen}
  onOpenChange={controller.setOpen}
>
  <PropsContextProvider props={propsContext}>
    {@render children?.()}
  </PropsContextProvider>
</PopoverContent>
