import { DialogTrigger } from "@/auto-generated";
import { mapChildren } from "@/overlays/childProps";
import {
  provideOverlayContext,
  useOwnController,
  type OverlayController,
  type OverlayType,
} from "@/overlays/overlayController";
import { isOverlay } from "@/overlays/overlayRegistry";
import { defineComponent, h, type PropType } from "vue";

/**
 * Builds `ModalTrigger`, `PopoverTrigger` and `LightBoxTrigger`.
 *
 * In Flow all three are the same component with a different overlay type — a
 * `DialogTrigger` around a trigger element and an overlay, with a props context
 * that gives the trigger its `onPress`. Here the trigger's props are merged
 * into the child directly, and the overlay recognises itself by being
 * registered as one.
 */
export const createOverlayTrigger = (name: string, overlayType: OverlayType) =>
  defineComponent({
    name,

    props: {
      /** Whether the overlay starts open. */
      isDefaultOpen: { type: Boolean, default: false },
      /** A controller to open and close the overlay from anywhere. */
      controller: {
        type: Object as PropType<OverlayController>,
        default: undefined,
      },
    },

    setup(props, { slots }) {
      const controller = useOwnController(
        () => props.controller,
        undefined,
        () => ({ isDefaultOpen: props.isDefaultOpen }),
      );

      /* By name only: the trigger button is not inside the overlay. */
      provideOverlayContext(overlayType, () => controller.value, {
        isOverlayContent: false,
      });

      return () => {
        /*
         * Everything that is not the overlay is the trigger. Flow's props
         * context names `Button` specifically; matching on "not the overlay"
         * covers the same case and keeps a wrapped trigger working.
         */
        const children = mapChildren(slots.default?.(), (child) =>
          isOverlay(child) ? undefined : { onPress: controller.value.open },
        );

        return h(
          DialogTrigger,
          {
            isOpen: controller.value.isOpen.value,
            onOpenChange: controller.value.setOpen,
          },
          () => children,
        );
      };
    },
  });
