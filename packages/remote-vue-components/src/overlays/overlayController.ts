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
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOpen: (isOpen: boolean) => void;
}

export interface UseOverlayControllerOptions {
  /** Whether the overlay starts open. @default false */
  isDefaultOpen?: boolean;
}

export const createOverlayController = (
  options: UseOverlayControllerOptions = {},
): OverlayController => {
  const isOpen = ref(options.isDefaultOpen ?? false);

  return {
    isOpen,
    open: () => (isOpen.value = true),
    close: () => (isOpen.value = false),
    toggle: () => (isOpen.value = !isOpen.value),
    setOpen: (open: boolean) => (isOpen.value = open),
  };
};

/**
 * A controller an app can hold itself, to open an overlay from anywhere — the
 * equivalent of Flow's `useOverlayController()`.
 */
export const useOverlayController = createOverlayController;

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
