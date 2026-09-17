import { inject, provide, ref, type InjectionKey, type Ref } from "vue";

/**
 * The Vue counterpart of Flow's `OverlayController`.
 *
 * Flow's version is a MobX model shared through React context; here the state
 * is a `ref` and the sharing is `provide`/`inject`. Same contract: a trigger
 * opens it, the overlay reads it, and anything inside can close it.
 */
export interface OverlayController {
  isOpen: Ref<boolean>;
  /**
   * Whether closing has to be confirmed first. Set by a `<Modal
   * confirm-on-close>`, not by the app.
   */
  confirmOnClose: Ref<boolean>;
  /** Whether the confirmation is on screen right now. */
  isConfirmingClose: Ref<boolean>;
  open: () => void;
  /** Closes right away, whatever `confirmOnClose` says. */
  close: () => void;
  toggle: () => void;
  setOpen: (isOpen: boolean) => void;
  /** Closes — or asks first, when the overlay requires confirmation. */
  requestClose: () => void;
  /** Answers a pending confirmation with yes: the overlay closes. */
  confirmClose: () => void;
  /** Answers a pending confirmation with no: the overlay stays open. */
  cancelClose: () => void;
}

export interface UseOverlayControllerOptions {
  /** Whether the overlay starts open. @default false */
  isDefaultOpen?: boolean;
}

/**
 * Builds a controller around an existing `isOpen`, so a second controller can
 * drive the same state — which is how the confirmation modal is bound to its
 * parent's `isConfirmingClose`.
 */
export const createOverlayControllerFor = (
  isOpen: Ref<boolean>,
): OverlayController => {
  const confirmOnClose = ref(false);
  const isConfirmingClose = ref(false);

  const open = () => {
    isConfirmingClose.value = false;
    isOpen.value = true;
  };

  const close = () => {
    isConfirmingClose.value = false;
    isOpen.value = false;
  };

  /*
   * Every close an app or the host can ask for goes through here, so a dismiss
   * — Escape, a click outside — is confirmed just like a button. The host
   * reports that dismiss as `openChange(false)`, and leaving `isOpen` alone is
   * what puts the overlay back: it is a controlled prop on the host's side.
   */
  const requestClose = () => {
    if (confirmOnClose.value && isOpen.value) {
      isConfirmingClose.value = true;
      return;
    }
    close();
  };

  return {
    isOpen,
    confirmOnClose,
    isConfirmingClose,
    open,
    close,
    toggle: () => (isOpen.value ? requestClose() : open()),
    setOpen: (nextIsOpen: boolean) => (nextIsOpen ? open() : requestClose()),
    requestClose,
    confirmClose: close,
    cancelClose: () => (isConfirmingClose.value = false),
  };
};

export const createOverlayController = (
  options: UseOverlayControllerOptions = {},
): OverlayController =>
  createOverlayControllerFor(ref(options.isDefaultOpen ?? false));

/**
 * A controller an app can hold itself, to open an overlay from anywhere — the
 * equivalent of Flow's `useOverlayController()`.
 */
export const useOverlayController = createOverlayController;

/**
 * Flow's name for the same thing, kept so a port from React does not have to
 * rename it. Flow's version picks the overlay type; there is one controller
 * here and the overlay decides what it is.
 */
export const useModalController = createOverlayController;

const overlayControllerKey: InjectionKey<OverlayController> = Symbol(
  "flowOverlayController",
);

export const provideOverlayController = (
  controller: OverlayController,
): void => {
  provide(overlayControllerKey, controller);
};

/** The controller of the nearest surrounding trigger or overlay, if any. */
export const injectOverlayController = (): OverlayController | undefined =>
  inject(overlayControllerKey, undefined);
