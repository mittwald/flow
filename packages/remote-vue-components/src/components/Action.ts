import { Button } from "@/auto-generated";
import { mapChildren } from "@/overlays/childProps";
import { injectOverlayController } from "@/overlays/overlayController";
import { defineComponent, ref, type PropType } from "vue";

export type ActionFn = (...args: never[]) => unknown | Promise<unknown>;

/**
 * Runs something when the button inside it is pressed, and shows how it went.
 *
 * Flow's `Action` is a state machine with a MobX model, batching, confirmation
 * modals and a props context that feeds `isPending` / `isSucceeded` /
 * `isFailed` to every `Button` below. This rebuild keeps the part an extension
 * actually writes — run, report, close the overlay — and drops the model: no
 * `ActionModel`, no confirmation modal, no nested batching.
 */
export const Action = defineComponent({
  name: "Action",

  props: {
    /** What to run. An async function drives the button's pending state. */
    onAction: {
      type: Function as PropType<ActionFn>,
      default: undefined,
    },
    /** Whether the surrounding overlay closes when the action succeeds. */
    closeModal: { type: Boolean, default: false },
    /** Alias of `closeModal`, for the non-modal overlays. */
    closeOverlay: { type: Boolean, default: false },
    /** How long the success state is shown, in ms. @default 2000 */
    successDuration: { type: Number, default: 2000 },
  },

  setup(props, { slots }) {
    const controller = injectOverlayController();
    const isPending = ref(false);
    const isSucceeded = ref(false);
    const isFailed = ref(false);

    const execute = async () => {
      isFailed.value = false;
      isSucceeded.value = false;

      try {
        if (props.onAction) {
          isPending.value = true;
          await props.onAction();

          /*
           * Only an action that ran can have succeeded. An `Action closeModal`
           * without one is a close button, and a check mark on it claims
           * something happened that did not.
           *
           * The state is the extension's, not the host's: the host renders
           * whatever `isSucceeded` says, so it has to be taken back here or the
           * button stays green.
           */
          isSucceeded.value = true;
          setTimeout(() => (isSucceeded.value = false), props.successDuration);
        }

        if (props.closeModal || props.closeOverlay) {
          controller?.close();
        }
      } catch (error) {
        /*
         * Reported, not rethrown. The call arrives from a host event listener,
         * so a rethrow becomes an unhandled rejection the app cannot catch —
         * and the button's failed state is the feedback that was asked for.
         */
        isFailed.value = true;
        console.error(error);
      } finally {
        isPending.value = false;
      }
    };

    return () =>
      mapChildren(slots.default?.(), (child) =>
        child.type === Button
          ? {
              onPress: () => void execute(),
              isPending: isPending.value,
              isSucceeded: isSucceeded.value,
              isFailed: isFailed.value,
            }
          : undefined,
      );
  },
});

export default Action;
