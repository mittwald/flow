import { ClearPropsContext, PopoverContent } from "@/auto-generated";
import {
  provideOverlayContext,
  useOwnController,
  useOverlayHandlers,
  type OverlayController,
} from "@/overlays/overlayController";
import { markAsOverlay } from "@/overlays/overlayRegistry";
import { defineComponent, h, onMounted, watch, type PropType } from "vue";
import { composition } from "@/lib/composition";
import { useComponentUsage } from "@/composables/useComponentUsage";

/* Flow's own class names — see the note in Modal.ts. */
const styles = {
  popover: "flow--popover",
};

export const Popover = markAsOverlay(
  defineComponent({
    name: "Popover",

    /* The rest — `placement`, `offset`, … — goes to `PopoverContent`. */
    inheritAttrs: false,

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
      /**
       * Whether the popover is open. Use it to control its state — then
       * `onOpenChange` must update the state this value comes from.
       */
      isOpen: { type: Boolean, default: undefined },
      /**
       * Whether the popover is open initially, when it has a controller of its
       * own. @default false
       */
      isDefaultOpen: { type: Boolean, default: undefined },
      /**
       * Called with the new state whenever the popover opens or closes. It only
       * reports the change; it never performs or suppresses it.
       */
      onOpenChange: {
        type: Function as PropType<(isOpen: boolean) => void>,
        default: undefined,
      },
    },

    setup(props, { slots, attrs }) {
      /* Flow's React `Popover` is a `flowComponent` and reports itself. */
      onMounted(useComponentUsage("Popover"));

      const controller = useOwnController(
        () => props.controller,
        "Popover",
        () => ({ isDefaultOpen: props.isDefaultOpen }),
      );

      provideOverlayContext("Popover", () => controller.value);

      /* The return value is dropped, as in Flow: this cannot abort. */
      const notifyOpenChange = (isOpen: boolean): void => {
        props.onOpenChange?.(isOpen);
      };
      useOverlayHandlers(() => controller.value, {
        onOpenChange: () => (props.onOpenChange ? notifyOpenChange : undefined),
      });

      /*
       * A controlled `isOpen` is mirrored into the controller, unreported —
       * and again after a close the app did not follow, as in Flow.
       */
      watch(
        () => [props.isOpen, controller.value.isOpen.value] as const,
        ([isOpen, current]) => {
          if (isOpen !== undefined && isOpen !== current) {
            controller.value.syncOpen(isOpen);
          }
        },
        { immediate: true },
      );

      return () => {
        const { class: className, ...contentAttrs } = attrs;

        /* A UI component: Flow clears the host's props context around it. */
        return h(ClearPropsContext, null, () =>
          h(
            PopoverContent,
            {
              ...contentAttrs,
              class: [styles.popover, className].filter(Boolean).join(" "),
              withTip: props.withTip,
              isDialogContent: props.isDialogContent,
              width: props.width,
              isOpen: controller.value.isOpen.value,
              onOpenChange: controller.value.setOpen,
            },
            () => slots.default?.(),
          ),
        );
      };
    },
  }),
);

composition(Popover);

export default Popover;
