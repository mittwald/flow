import { ActionGroup, Content, OverlayContent } from "@/auto-generated";
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
  overlay: "flow--overlay",
  lightBox: "flow--light-box",
  fitScreen: "flow--light-box--fit-screen",
  content: "flow--light-box--content",
  actionGroup: "flow--light-box--action-group",
};

export const LightBox = markAsOverlay(
  defineComponent({
    name: "LightBox",

    props: {
      /** Whether content may exceed the available screen space. @default true */
      fitScreen: { type: Boolean, default: true },
      /** A controller to open and close the light box from anywhere. */
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
        const className = [
          styles.overlay,
          styles.lightBox,
          props.fitScreen ? styles.fitScreen : undefined,
          attrs.class,
        ]
          .filter(Boolean)
          .join(" ");

        const children = mapChildren(slots.default?.(), (child) => {
          if (child.type === Content) {
            return { class: styles.content };
          }
          if (child.type === ActionGroup) {
            return {
              class: styles.actionGroup,
              spacing: "m",
              preserveOrder: true,
            };
          }
          return undefined;
        });

        return h(
          OverlayContent,
          {
            class: className,
            isOpen: controller.isOpen.value,
            isDismissable: true,
            onOpenChange: controller.setOpen,
          },
          () => children,
        );
      };
    },
  }),
);

export default LightBox;
