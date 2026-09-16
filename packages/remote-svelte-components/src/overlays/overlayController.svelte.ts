import { getContext, setContext } from "svelte";

export interface UseOverlayControllerOptions {
  /** Whether the overlay starts open. @default false */
  isDefaultOpen?: boolean;
}

/**
 * The Svelte counterpart of Flow's `OverlayController`.
 *
 * Flow's version is a MobX model shared through React context; here the state
 * is a rune and the sharing is `setContext`/`getContext`. Same contract: a
 * trigger opens it, the overlay reads it, and anything inside can close it.
 */
export class OverlayController {
  public isOpen = $state(false);

  public constructor(options: UseOverlayControllerOptions = {}) {
    this.isOpen = options.isDefaultOpen ?? false;
  }

  public open = (): void => {
    this.isOpen = true;
  };

  public close = (): void => {
    this.isOpen = false;
  };

  public toggle = (): void => {
    this.isOpen = !this.isOpen;
  };

  public setOpen = (isOpen: boolean): void => {
    this.isOpen = isOpen;
  };
}

export const createOverlayController = (
  options: UseOverlayControllerOptions = {},
): OverlayController => new OverlayController(options);

/**
 * A controller an app can hold itself, to open an overlay from anywhere — the
 * equivalent of Flow's `useOverlayController()`.
 */
export const useOverlayController = createOverlayController;

const overlayControllerKey = Symbol.for("flow.remote.svelte.overlayController");

export const setOverlayController = (controller: OverlayController): void => {
  setContext(overlayControllerKey, controller);
};

/** The controller of the nearest surrounding trigger or overlay, if any. */
export const getSurroundingOverlayController = ():
  OverlayController | undefined => getContext(overlayControllerKey);
