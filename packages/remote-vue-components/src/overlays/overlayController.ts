import {
  computed,
  inject,
  provide,
  ref,
  watchEffect,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from "vue";

/**
 * The Vue counterpart of Flow's `OverlayController`.
 *
 * Flow's version is a MobX model shared through React context; here the state
 * is a `ref` and the sharing is `provide`/`inject`. Same contract: a trigger
 * opens it, the overlay reads it, and anything inside can close it.
 */
export type OverlayOpenHandler = () => unknown;
export type OverlayCloseHandler = () => unknown;
export type OverlayOpenStateHandler = (isOpen: boolean) => unknown;

export interface OverlayCloseOptions {
  /** Close without asking, even when the overlay requires confirmation. */
  bypassConfirmation?: boolean;
}

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
  /**
   * Closes — or asks first, when the overlay requires confirmation and
   * `bypassConfirmation` is not set. Flow's `close(options)`.
   */
  close: (options?: OverlayCloseOptions) => void;
  toggle: () => void;
  setOpen: (isOpen: boolean, options?: OverlayCloseOptions) => void;
  /**
   * Sets the state without running a handler — to mirror a controlled `isOpen`,
   * whose change came from the app.
   */
  syncOpen: (isOpen: boolean) => void;
  /** `close()` without options: asks first, when the overlay requires it. */
  requestClose: () => void;
  /** Answers a pending confirmation with yes: the overlay closes. */
  confirmClose: () => void;
  /** Answers a pending confirmation with no: the overlay stays open. */
  cancelClose: () => void;
  /** Flow's name for `cancelClose`. */
  cancelConfirmation: () => void;
  /*
   * As in Flow: a handler returning `false` aborts the change. Each returns
   * its disposer.
   */
  addOnOpen: (handler: OverlayOpenHandler) => () => void;
  addOnClose: (handler: OverlayCloseHandler) => () => void;
  addOnOpenChange: (handler: OverlayOpenStateHandler) => () => void;
}

export interface CreateOverlayControllerOptions {
  /** Whether the overlay starts open. @default false */
  isDefaultOpen?: boolean;
}

export interface UseOverlayControllerOptions extends CreateOverlayControllerOptions {
  /**
   * Hand back the controller of the surrounding overlay of the requested type,
   * when there is one, instead of a new one — as in Flow. @default true
   */
  reuseControllerFromContext?: boolean;
}

const controllers = new WeakSet<object>();

/** Whether a value is a controller, rather than options naming one. */
export const isOverlayController = (
  value: unknown,
): value is OverlayController =>
  typeof value === "object" && value !== null && controllers.has(value);

const addTo =
  <T>(handlers: Set<T>) =>
  (handler: T): (() => void) => {
    handlers.add(handler);
    return () => handlers.delete(handler);
  };

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
  const onOpenHandlers = new Set<OverlayOpenHandler>();
  const onCloseHandlers = new Set<OverlayCloseHandler>();
  const onOpenChangeHandlers = new Set<OverlayOpenStateHandler>();
  /* Flow's `openStateInFlight`: a handler setting the state again is a no-op. */
  let inFlight: boolean | undefined;

  /* Flow's `applyOpenState`, after the confirmation. */
  const apply = (toOpen: boolean): void => {
    if (isOpen.value === toOpen || inFlight === toOpen) {
      return;
    }
    inFlight = toOpen;
    try {
      const run = (handlers: Set<(isOpen: boolean) => unknown>) =>
        [...handlers].map((handler) => handler(toOpen)).includes(false);
      const aborted =
        run(toOpen ? onOpenHandlers : onCloseHandlers) ||
        run(onOpenChangeHandlers);
      if (!aborted) {
        isOpen.value = toOpen;
      }
    } finally {
      inFlight = undefined;
    }
  };

  const open = () => {
    isConfirmingClose.value = false;
    apply(true);
  };

  const closeNow = () => {
    isConfirmingClose.value = false;
    apply(false);
  };

  /*
   * Every close an app or the host can ask for goes through here, so a dismiss
   * — Escape, a click outside — is confirmed just like a button. The host
   * reports that dismiss as `openChange(false)`, and leaving `isOpen` alone is
   * what puts the overlay back: it is a controlled prop on the host's side.
   */
  const close = (options: OverlayCloseOptions = {}) => {
    if (!options.bypassConfirmation && confirmOnClose.value && isOpen.value) {
      isConfirmingClose.value = true;
      return;
    }
    closeNow();
  };

  const controller: OverlayController = {
    isOpen,
    confirmOnClose,
    isConfirmingClose,
    open,
    close,
    toggle: () => (isOpen.value ? close() : open()),
    setOpen: (nextIsOpen: boolean, options?: OverlayCloseOptions) =>
      nextIsOpen ? open() : close(options),
    syncOpen: (nextIsOpen: boolean) => {
      isOpen.value = nextIsOpen;
    },
    requestClose: () => close(),
    confirmClose: closeNow,
    cancelClose: () => (isConfirmingClose.value = false),
    cancelConfirmation: () => (isConfirmingClose.value = false),
    addOnOpen: addTo(onOpenHandlers),
    addOnClose: addTo(onCloseHandlers),
    addOnOpenChange: addTo(onOpenChangeHandlers),
  };
  controllers.add(controller);
  return controller;
};

/**
 * Registers an overlay's `onOpen`/`onClose`/`onOpenChange` props on its
 * controller for as long as it is mounted — Flow's `useUpdateOptions`.
 */
export const useOverlayHandlers = (
  controller: () => OverlayController,
  handlers: {
    onOpen?: () => OverlayOpenHandler | undefined;
    onClose?: () => OverlayCloseHandler | undefined;
    onOpenChange?: () => OverlayOpenStateHandler | undefined;
  },
): void => {
  watchEffect((onCleanup) => {
    const target = controller();
    const onOpen = handlers.onOpen?.();
    const onClose = handlers.onClose?.();
    const onOpenChange = handlers.onOpenChange?.();
    const disposers = [
      onOpen && target.addOnOpen(onOpen),
      onClose && target.addOnClose(onClose),
      onOpenChange && target.addOnOpenChange(onOpenChange),
    ];
    onCleanup(() => disposers.forEach((dispose) => dispose?.()));
  });
};

export const createOverlayController = (
  options: CreateOverlayControllerOptions = {},
): OverlayController =>
  createOverlayControllerFor(ref(options.isDefaultOpen ?? false));

/**
 * A controller an app can hold itself, to open an overlay from anywhere —
 * Flow's `useOverlayController(type, options)`. Given a type, it hands back the
 * surrounding overlay's controller of that type when there is one, as Flow
 * does; `reuseControllerFromContext: false` asks for a new one regardless.
 *
 * Also takes the options alone, for a controller that belongs to no type. Call
 * it in `setup()`: the surrounding overlay is found through `inject`.
 */
export function useOverlayController(
  type: OverlayType,
  options?: UseOverlayControllerOptions,
): OverlayController;
export function useOverlayController(
  options?: CreateOverlayControllerOptions,
): OverlayController;
export function useOverlayController(
  typeOrOptions?: OverlayType | CreateOverlayControllerOptions,
  options: UseOverlayControllerOptions = {},
): OverlayController {
  if (typeof typeOrOptions !== "string") {
    return createOverlayController(typeOrOptions);
  }
  const { reuseControllerFromContext = true } = options;
  const fromContext = reuseControllerFromContext
    ? injectOverlayController(typeOrOptions)
    : undefined;
  return fromContext ?? createOverlayController(options);
}

/**
 * Flow's `useModalController(options)`: `useOverlayController("Modal",
 * options)`.
 */
export const useModalController = (
  options?: UseOverlayControllerOptions,
): OverlayController => useOverlayController("Modal", options);

/** The overlays a controller can be registered for, by Flow component name. */
export type OverlayType = "Modal" | "Popover" | "LightBox";

/**
 * Flow's `OverlayContext`: the surrounding overlays' controllers by component
 * name, and the one whose content this subtree is. A trigger registers its
 * controller by name only — its button is not inside the overlay it opens.
 */
export interface OverlayContext {
  byType: Partial<Record<OverlayType, OverlayController>>;
  nearest?: OverlayController;
}

const overlayContextKey: InjectionKey<OverlayContext> =
  Symbol("flowOverlayContext");

export const injectOverlayContext = (): OverlayContext =>
  inject(overlayContextKey, { byType: {} });

/**
 * Provides the context for a subtree. The controller may be a getter: an
 * overlay whose `controller` prop changes hands its subtree the new one, and
 * the context reads it when it is asked rather than when it was provided.
 */
export const provideOverlayContext = (
  type: OverlayType,
  controller: OverlayController | (() => OverlayController),
  options: { isOverlayContent?: boolean } = {},
): void => {
  const { isOverlayContent = true } = options;
  const parent = injectOverlayContext();
  const current =
    typeof controller === "function" ? controller : () => controller;

  provide(overlayContextKey, {
    get byType() {
      return { ...parent.byType, [type]: current() };
    },
    get nearest() {
      return isOverlayContent ? current() : parent.nearest;
    },
  });
};

/**
 * The controller an overlay or trigger drives, in Flow's order of precedence:
 * the one the app passes, the one of a surrounding trigger of that type, or one
 * of its own. It follows the prop — Flow reads it on every render.
 */
export const useOwnController = (
  fromProp: () => OverlayController | undefined,
  inheritFrom: OverlayType | undefined,
  options: () => CreateOverlayControllerOptions = () => ({}),
): ComputedRef<OverlayController> => {
  const context = injectOverlayContext();
  let own: OverlayController | undefined;

  return computed(
    () =>
      fromProp() ??
      (inheritFrom ? context.byType[inheritFrom] : undefined) ??
      (own ??= createOverlayController(options())),
  );
};

/**
 * The controller of the surrounding overlay of that type — or, without a type,
 * of the overlay this component is inside.
 */
export const injectOverlayController = (
  type?: OverlayType,
): OverlayController | undefined => {
  const context = injectOverlayContext();
  return type ? context.byType[type] : context.nearest;
};
