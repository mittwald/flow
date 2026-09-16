import {
  ActionGroup,
  Content,
  Heading,
  OverlayContent,
} from "@/auto-generated";
import { mapChildren } from "@/overlays/childProps";
import {
  createOverlayController,
  injectOverlayController,
  provideOverlayController,
  type OverlayController,
} from "@/overlays/overlayController";
import { markAsOverlay } from "@/overlays/overlayRegistry";
import { defineComponent, h, type PropType } from "vue";

export type ModalSize = "s" | "m" | "l";

/*
 * Flow's `Modal` is a React composition, not a remote element: it renders an
 * `OverlayContent` and configures the components inside it through a props
 * context — the header, the content padding, the footer spacing. Both halves
 * are rebuilt here, so a Vue app writes `Modal` and not the overlay plumbing.
 *
 * The class names are Flow's own, taken from `Modal.module.scss` by way of the
 * generated `flow--…` names. They are internal, and repeating them is the price
 * of a composition that lives in React: the alternative — marking `Modal`
 * `@flr-generate`, so the host materialises the whole thing from one element —
 * would make this file unnecessary.
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

export const Modal = markAsOverlay(
  defineComponent({
    name: "Modal",

    props: {
      /** The size of the modal. @default "s" */
      size: { type: String as PropType<ModalSize>, default: "s" },
      /** Whether the modal is displayed as an off canvas. */
      offCanvas: { type: Boolean, default: false },
      /** Which side the off canvas comes from. @default "right" */
      offCanvasOrientation: {
        type: String as PropType<"left" | "right">,
        default: "right",
      },
      /** Whether a click outside closes the modal. @default true */
      isDismissable: { type: Boolean, default: true },
      /** A controller to open and close the modal from anywhere. */
      controller: {
        type: Object as PropType<OverlayController>,
        default: undefined,
      },
    },

    setup(props, { slots, attrs }) {
      /*
       * Three ways to own the state, in Flow's order of precedence: a
       * controller the app passes, the controller of a surrounding trigger, or
       * one of its own.
       */
      const controller =
        props.controller ??
        injectOverlayController() ??
        createOverlayController();

      // So an `Action closeModal` inside finds it.
      provideOverlayController(controller);

      return () => {
        const className = [
          styles.overlay,
          props.offCanvas ? styles.offCanvas : styles.modal,
          styles.size(props.size),
          props.offCanvas && props.offCanvasOrientation === "left"
            ? styles.left
            : undefined,
          attrs.class,
        ]
          .filter(Boolean)
          .join(" ");

        const children = mapChildren(slots.default?.(), (child) => {
          if (child.type === Heading) {
            return { class: styles.header, level: 2 };
          }
          if (child.type === Content) {
            return { class: styles.content };
          }
          if (child.type === ActionGroup) {
            return { class: styles.actionGroup, spacing: "m" };
          }
          return undefined;
        });

        return h(
          OverlayContent,
          {
            class: className,
            isOpen: controller.isOpen.value,
            isDismissable: props.isDismissable,
            onOpenChange: controller.setOpen,
          },
          () => children,
        );
      };
    },
  }),
);

export default Modal;
