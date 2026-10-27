import { Button, DialogTrigger, MenuItem } from "@/auto-generated";
import { Action } from "@/components/Action";
import { applyChildRules, type ChildRules } from "@/overlays/childProps";
import {
  provideOverlayContext,
  useOwnController,
  type OverlayController,
  type OverlayType,
} from "@/overlays/overlayController";
import { useComponentUsage } from "@/composables/useComponentUsage";
import { defineComponent, h, onMounted, type PropType } from "vue";

/**
 * Builds `ModalTrigger`, `PopoverTrigger` and `LightBoxTrigger`.
 *
 * In Flow all three are the same component with a different overlay type — a
 * `DialogTrigger` around a trigger element and an overlay, with a props context
 * that gives the trigger's `Button` its `onPress`. Here that is merged into the
 * `Button` directly.
 *
 * `reportsUsage`: whether Flow's React trigger is a `flowComponent`, which
 * reports itself.
 *
 * `isOverlayHoistable`: whether a `MenuItem` may be the trigger, as in Flow's
 * `ModalTrigger`/`LightBoxTrigger` inside a `ContextMenu`. Flow emits no
 * `DialogTrigger` then — the host menu renders no item inside one — and opens
 * the overlay from the item's `onAction`. The overlay itself is not hoisted out
 * of the menu here (see the known gaps in the README).
 */
export const createOverlayTrigger = (
  name: string,
  overlayType: OverlayType,
  {
    reportsUsage,
    isOverlayHoistable = false,
  }: { reportsUsage: boolean; isOverlayHoistable?: boolean },
) =>
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
      if (reportsUsage) {
        onMounted(useComponentUsage(name));
      }

      const controller = useOwnController(
        () => props.controller,
        undefined,
        () => ({ isDefaultOpen: props.isDefaultOpen }),
      );

      /* By name only: the trigger button is not inside the overlay. */
      provideOverlayContext(overlayType, () => controller.value, {
        isOverlayContent: false,
      });

      /*
       * Flow's props context names `Button`, and reaches it through an
       * `Action`, which passes the context on.
       */
      const triggerRules: ChildRules = (child) =>
        child.type === Button
          ? { props: { onPress: controller.value.open } }
          : child.type === Action
            ? { children: triggerRules }
            : isOverlayHoistable && child.type === MenuItem
              ? { props: { onAction: controller.value.open } }
              : undefined;

      return () => {
        const children = applyChildRules(slots.default?.(), triggerRules);

        if (
          isOverlayHoistable &&
          children.some((child) => child.type === MenuItem)
        ) {
          return children;
        }

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
