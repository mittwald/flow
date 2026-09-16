<script lang="ts" module>
  export type ActionFn = (...args: never[]) => unknown | Promise<unknown>;
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import PropsContextProvider from "../lib/PropsContextProvider.svelte";
  import { getSurroundingOverlayController } from "../overlays/overlayController.svelte.js";

  /**
   * Runs something when the button inside it is pressed, and shows how it went.
   *
   * Flow's `Action` is a state machine with a MobX model, batching,
   * confirmation modals and a props context that feeds `isPending` /
   * `isSucceeded` / `isFailed` to every `Button` below. This rebuild keeps the
   * part an extension actually writes — run, report, close the overlay — and
   * drops the model: no `ActionModel`, no confirmation modal, no nested
   * batching.
   */
  interface Props {
    /** What to run. An async function drives the button's pending state. */
    onAction?: ActionFn;
    /** Whether the surrounding overlay closes when the action succeeds. */
    closeModal?: boolean;
    /** Alias of `closeModal`, for the non-modal overlays. */
    closeOverlay?: boolean;
    /** How long the success state is shown, in ms. @default 2000 */
    successDuration?: number;
    children?: Snippet;
  }

  const {
    onAction,
    closeModal = false,
    closeOverlay = false,
    successDuration = 2000,
    children,
  }: Props = $props();

  const controller = getSurroundingOverlayController();

  let isPending = $state(false);
  let isSucceeded = $state(false);
  let isFailed = $state(false);

  const execute = async () => {
    isFailed = false;
    isSucceeded = false;

    try {
      if (onAction) {
        isPending = true;
        await onAction();

        /*
         * Only an action that ran can have succeeded. An `Action closeModal`
         * without one is a close button, and a check mark on it claims
         * something happened that did not.
         *
         * The state is the extension's, not the host's: the host renders
         * whatever `isSucceeded` says, so it has to be taken back here or the
         * button stays green.
         */
        isSucceeded = true;
        setTimeout(() => (isSucceeded = false), successDuration);
      }

      if (closeModal || closeOverlay) {
        controller?.close();
      }
    } catch (error) {
      /*
       * Reported, not rethrown. The call arrives from a host event listener, so
       * a rethrow becomes an unhandled rejection the app cannot catch — and the
       * button's failed state is the feedback that was asked for.
       */
      isFailed = true;
      console.error(error);
    } finally {
      isPending = false;
    }
  };

  /*
   * Getters, not values: the props context is read once, while a component
   * below initializes, and what it holds has to stay live afterwards.
   */
  const propsContext = {
    Button: {
      onPress: () => void execute(),
      get isPending() {
        return isPending;
      },
      get isSucceeded() {
        return isSucceeded;
      },
      get isFailed() {
        return isFailed;
      },
    },
  };
</script>

<PropsContextProvider props={propsContext}>
  {@render children?.()}
</PropsContextProvider>
