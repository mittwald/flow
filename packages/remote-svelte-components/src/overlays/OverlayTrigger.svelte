<script lang="ts">
  import type { Snippet } from "svelte";
  import DialogTrigger from "../auto-generated/DialogTrigger.svelte";
  import PropsContextProvider from "../lib/PropsContextProvider.svelte";
  import {
    createOverlayController,
    setOverlayController,
    type OverlayController,
  } from "./overlayController.svelte.js";

  /**
   * What `ModalTrigger`, `PopoverTrigger` and `LightBoxTrigger` all are.
   *
   * In Flow the three are the same component with a different overlay type — a
   * `DialogTrigger` around a trigger element and an overlay, with a props
   * context that gives the trigger its `onPress`. Nothing here differs by
   * overlay either, so the package exports this one component under all three
   * names.
   */
  interface Props {
    /** Whether the overlay starts open. */
    isDefaultOpen?: boolean;
    /** A controller to open and close the overlay from anywhere. */
    controller?: OverlayController;
    children?: Snippet;
  }

  const {
    isDefaultOpen = false,
    controller: givenController,
    children,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  const controller =
    givenController ?? createOverlayController({ isDefaultOpen });

  setOverlayController(controller);

  /*
   * Inside the `DialogTrigger`, not around it: a generated component clears the
   * props context for its children, so a context set outside would never reach
   * the `Button`.
   *
   * Only `Button` is configured, the way Flow's own props context does. The
   * overlay next to it is a composition, not a `Button`, so it is unaffected —
   * and so is every `Button` inside it, because the overlay's own
   * `OverlayContent` clears the context again.
   */
  const propsContext = {
    Button: { onPress: controller.open },
  };
</script>

<DialogTrigger isOpen={controller.isOpen} onOpenChange={controller.setOpen}>
  <PropsContextProvider props={propsContext}>
    {@render children?.()}
  </PropsContextProvider>
</DialogTrigger>
