import { Content, PopoverContent } from "@/auto-generated";
import { mapChildren } from "@/overlays/childProps";
import {
  createOverlayController,
  injectOverlayController,
  provideOverlayController,
  type OverlayController,
} from "@/overlays/overlayController";
import { markAsOverlay } from "@/overlays/overlayRegistry";
import { defineComponent, h, type PropType } from "vue";

/* Flow's own class names — see the note in Modal.ts. */
const styles = {
  popover: "flow--popover",
  content: "flow--popover--content",
};

export const Popover = markAsOverlay(
  defineComponent({
    name: "Popover",

    props: {
      /** Whether the popover shows a tip pointing at its trigger. */
      withTip: { type: Boolean, default: false },
      /** Whether the popover holds a dialog. */
      isDialogContent: { type: Boolean, default: undefined },
      /** A fixed width. */
      width: {
        type: [String, Number] as PropType<string | number>,
        default: undefined,
      },
      /** A controller to open and close the popover from anywhere. */
      controller: {
        type: Object as PropType<OverlayController>,
        default: undefined,
      },
    },

    setup(props, { slots, attrs }) {
      const controller =
        props.controller ??
        injectOverlayController() ??
        createOverlayController();

      provideOverlayController(controller);

      return () => {
        const children = mapChildren(slots.default?.(), (child) =>
          child.type === Content ? { class: styles.content } : undefined,
        );

        return h(
          PopoverContent,
          {
            class: [styles.popover, attrs.class].filter(Boolean).join(" "),
            withTip: props.withTip,
            isDialogContent: props.isDialogContent,
            width: props.width,
            isOpen: controller.isOpen.value,
            onOpenChange: controller.setOpen,
          },
          () => children,
        );
      };
    },
  }),
);

export default Popover;
