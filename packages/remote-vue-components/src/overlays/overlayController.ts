import {
  OverlayState,
  type OverlayCloseHandler,
  type OverlayCloseOptions,
  type OverlayOpenHandler,
  type OverlayOpenStateHandler,
} from "@mittwald/flow-components-base";
import { reaction, runInAction } from "mobx";
import {
  computed,
  customRef,
  inject,
  markRaw,
  provide,
  watchEffect,
  type ComputedRef,
  type InjectionKey,
  type Raw,
  type Ref,
} from "vue";

export type {
  OverlayCloseHandler,
  OverlayCloseOptions,
  OverlayOpenHandler,
  OverlayOpenStateHandler,
} from "@mittwald/flow-components-base";

/**
 * The Vue counterpart of Flow's `OverlayController`.
 *
 * The state is `OverlayState` from `@mittwald/flow-components-base`, the one
 * React's controller runs on; this wraps it in refs and shares it through
 * `provide`/`inject`. Same contract: a trigger opens it, the overlay reads it,
 * and anything inside can close it.
 *
 * `Raw`, as `markRaw` makes it: reactive state keeps the controller as it is,
 * and its type says so too.
 */
export interface OverlayController extends Raw<Record<never, never>> {
  /** Writing it sets the state without running a handler, like `syncOpen`. */
  isOpen: Ref<boolean>;
  /**
   * Whether closing has to be confirmed first — combined from every source: a
   * `<Modal confirm-on-close>` and what the app writes here.
   */
  confirmOnClose: Ref<boolean>;
  /**
   * Whether the confirmation is on screen right now. Writing `false` dismisses
   * it; only a close shows it.
   */
  isConfirmingClose: Ref<boolean>;
  /** Whether the overlay's content is suspended. Not used by this binding yet. */
  isContentSuspended: Ref<boolean>;
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
  /**
   * Closes without a confirmation until the returned disposer is called — as in
   * Flow, around an operation that closes the overlay deliberately.
   */
  grantCloseWithoutConfirmation: () => () => void;
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

/* Each controller's state, which is also how a controller is recognized. */
const states = new WeakMap<object, OverlayState>();

/** Whether a value is a controller, rather than options naming one. */
export const isOverlayController = (
  value: unknown,
): value is OverlayController =>
  typeof value === "object" && value !== null && states.has(value);

/*
 * A ref over one value of the state: a read subscribes through MobX, a write
 * goes to the state. The reaction lives as long as the controller does — it
 * is held by nothing but the state it observes.
 */
const stateRef = <T>(read: () => T, write: (value: T) => void): Ref<T> =>
  customRef((track, trigger) => {
    reaction(read, trigger);
    return {
      get: () => {
        track();
        return read();
      },
      set: write,
    };
  });

export const createOverlayController = (
  options: CreateOverlayControllerOptions = {},
): OverlayController => {
  const state = new OverlayState({ isDefaultOpen: options.isDefaultOpen });
  /* The source an app sets through `confirmOnClose.value`. */
  const ownSource = {};

  const controller: OverlayController = {
    isOpen: stateRef(() => state.isOpen, state.syncOpen),
    confirmOnClose: stateRef(
      () => state.confirmOnCloseEnabled,
      (confirmOnClose) =>
        confirmOnClose
          ? state.setConfirmOnCloseSource(ownSource, true)
          : state.removeConfirmOnCloseSource(ownSource),
    ),
    isConfirmingClose: stateRef(
      () => state.showConfirmationModal,
      (isConfirming) => {
        if (!isConfirming) {
          state.cancelConfirmation();
        }
      },
    ),
    isContentSuspended: stateRef(
      () => state.isContentSuspended,
      state.setIsContentSuspended,
    ),
    open: state.open,
    close: state.close,
    toggle: state.toggle,
    setOpen: state.setOpen,
    syncOpen: state.syncOpen,
    requestClose: () => state.close(),
    /*
     * React's `useCloseOverlayConfirmationController` confirms the same way.
     * One action, so no observer sees the confirmation gone and the overlay
     * still open.
     */
    confirmClose: () =>
      runInAction(() => {
        state.confirmClose();
        state.close();
      }),
    cancelClose: state.cancelConfirmation,
    cancelConfirmation: state.cancelConfirmation,
    grantCloseWithoutConfirmation: () => state.grantCloseWithoutConfirmation(),
    addOnOpen: (handler) => state.addOnOpen(handler),
    addOnClose: (handler) => state.addOnClose(handler),
    addOnOpenChange: (handler) => state.addOnOpenChange(handler),
  };
  /*
   * Raw, so `reactive()`, `ref()` or a store hold the controller itself: a
   * proxy would unwrap its refs and miss the `states` map.
   */
  states.set(markRaw(controller), state);
  return controller;
};

/**
 * Registers a component's opinion on close confirmation for as long as it is
 * mounted — Flow's `useConfirmOnCloseSource`. `undefined` contributes nothing,
 * so the other sources decide.
 */
export const useConfirmOnCloseSource = (
  controller: () => OverlayController,
  confirmOnClose: () => boolean | undefined,
): void => {
  const source = {};

  watchEffect((onCleanup) => {
    const state = states.get(controller());
    const value = confirmOnClose();
    if (!state || value === undefined) {
      return;
    }
    state.setConfirmOnCloseSource(source, value);
    onCleanup(() => state.removeConfirmOnCloseSource(source));
  });
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
