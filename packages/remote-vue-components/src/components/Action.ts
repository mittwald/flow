import { Button, Link, MenuItem } from "@/auto-generated";
import { watchMobxValue } from "@/lib/mobxSelector";
import { dynamic, mapChildren } from "@/overlays/childProps";
import {
  injectOverlayContext,
  isOverlayController,
  type OverlayContext,
  type OverlayController,
  type OverlayType,
} from "@/overlays/overlayController";
import { ActionState } from "@mittwald/flow-components-base";
import {
  defineComponent,
  inject,
  provide,
  type ExtractPropTypes,
  type InjectionKey,
  type PropType,
} from "vue";
import { composition } from "@/lib/composition";

export type ActionFn = (...args: never[]) => unknown | Promise<unknown>;

export interface CloseOverlayOptions {
  /** The overlay to close. Omitted, the nearest enclosing one. */
  overlay?: OverlayType | OverlayController;
  /** Closes a `<Modal confirm-on-close>` without asking first. */
  bypassConfirmation?: boolean;
}

export type CloseModalOptions = Omit<CloseOverlayOptions, "overlay">;

/** `true` is the nearest enclosing overlay, a name the nearest of that type. */
export type OverlayReference =
  OverlayType | OverlayController | CloseOverlayOptions | true;

const actionProps = {
  /**
   * What to run. Returning a promise puts the button into its pending and
   * feedback states.
   */
  onAction: { type: Function as PropType<ActionFn>, default: undefined },
  /**
   * The overlay to close. `true` closes the nearest enclosing overlay,
   * whichever it is; a name (`"Popover"`) the nearest of that type.
   */
  closeOverlay: {
    type: [Boolean, String, Object] as PropType<
      boolean | OverlayType | OverlayController | CloseOverlayOptions
    >,
    default: undefined,
  },
  /** The overlay to open. */
  openOverlay: {
    type: [String, Object] as PropType<OverlayType | OverlayController>,
    default: undefined,
  },
  /** The overlay to open or close. */
  toggleOverlay: {
    type: [String, Object] as PropType<OverlayType | OverlayController>,
    default: undefined,
  },
  /** Whether the surrounding modal is closed. */
  closeModal: {
    type: [Boolean, Object] as PropType<boolean | CloseModalOptions>,
    default: undefined,
  },
  /** Whether the surrounding modal is opened. */
  openModal: { type: Boolean, default: undefined },
  /** Whether the surrounding modal is opened or closed. */
  toggleModal: { type: Boolean, default: undefined },
  /** Stops the execution here: parent actions are not executed. */
  break: { type: Boolean, default: undefined },
  /** The number of parent actions skipped. `true` skips one. */
  skip: { type: [Boolean, Number], default: undefined },
  /**
   * Whether success feedback is shown. Async actions show it by default; set
   * `false` to suppress it, `true` to show it for a sync action too.
   */
  showFeedback: { type: Boolean, default: undefined },
};

type ActionProps = ExtractPropTypes<typeof actionProps>;

interface ActionModel {
  props: ActionProps;
  parent?: ActionModel;
  state: ActionState;
  overlayContext: OverlayContext;
}

const actionKey: InjectionKey<ActionModel> = Symbol("flowAction");

type Fn = (...args: unknown[]) => unknown;

/* `@/lib/promises/callFunctionsInOrder` in packages/components. */
const callFunctionsInOrder =
  (fns: Fn[]) =>
  (...args: unknown[]): unknown => {
    const [first, ...rest] = fns;
    if (!first) {
      return undefined;
    }
    const result = first(...args);
    const next = () =>
      rest.length === 0 ? result : callFunctionsInOrder(rest)(...args);
    return result instanceof Promise ? result.then(next) : next();
  };

const resolveOverlay = (
  action: ActionModel,
  from: OverlayReference,
): OverlayController | undefined => {
  if (isOverlayController(from)) {
    return from;
  }
  if (typeof from === "string") {
    return action.overlayContext.byType[from];
  }
  if (from === true || from.overlay === undefined) {
    return action.overlayContext.nearest;
  }
  return resolveOverlay(action, from.overlay);
};

/**
 * `close` asks a `<Modal confirm-on-close>` first; the options object can
 * bypass that.
 */
const closeOverlay = (
  controller: OverlayController | undefined,
  options: unknown,
): void => {
  const bypass =
    typeof options === "object" &&
    options !== null &&
    !isOverlayController(options) &&
    (options as CloseOverlayOptions).bypassConfirmation === true;

  controller?.close({ bypassConfirmation: bypass });
};

/* `getExecutionFunction` in packages/components, without confirmations. */
const getExecutionFunction = (action: ActionModel): Fn => {
  const {
    onAction,
    openOverlay,
    closeOverlay: closeOverlayProp,
    toggleOverlay,
    openModal,
    closeModal,
    toggleModal,
  } = action.props;

  if (onAction) {
    return onAction as Fn;
  }
  if (openOverlay) {
    return () => resolveOverlay(action, openOverlay)?.open();
  }
  if (closeOverlayProp) {
    return () =>
      closeOverlay(
        resolveOverlay(action, closeOverlayProp as OverlayReference),
        closeOverlayProp,
      );
  }
  if (toggleOverlay) {
    return () => resolveOverlay(action, toggleOverlay)?.toggle();
  }
  if (openModal) {
    return () => resolveOverlay(action, "Modal")?.open();
  }
  if (toggleModal) {
    return () => resolveOverlay(action, "Modal")?.toggle();
  }
  if (closeModal) {
    return () => closeOverlay(resolveOverlay(action, "Modal"), closeModal);
  }
  return () => undefined;
};

/*
 * `ActionExecution` in packages/components: the pressed action and its parents
 * run from the inside out, and each parent without an `onAction` starts a new
 * batch, which runs once the one before it has finished.
 */
const getBatches = (action: ActionModel): ActionModel[][] => {
  const batches: ActionModel[][] = [];
  let batch: ActionModel[] = [];
  let current: ActionModel | undefined = action;
  let skipCount = 0;

  while (current) {
    const { onAction, break: stop, skip } = current.props;

    if (skip) {
      skipCount = skip === true ? 1 : Number(skip);
      current = current.parent;
      continue;
    }
    if (skipCount > 0) {
      current = current.parent;
      skipCount--;
      continue;
    }
    if (stop) {
      break;
    }

    if (onAction) {
      batch.push(current);
    } else {
      batches.push(batch);
      batch = [current];
    }
    current = current.parent;
  }

  batches.push(batch);
  return batches;
};

/* `ActionExecutionBatch.executeBatch` in packages/components. */
const executeBatch = (
  base: ActionModel,
  batch: ActionModel[],
  args: unknown[],
): unknown => {
  if (batch.length === 0) {
    return undefined;
  }

  const state = base.state.withFeedback(batch.at(-1)?.props.showFeedback);
  const onError = (error: unknown): never => {
    void state.onFailed(error);
    throw error;
  };

  try {
    const result = callFunctionsInOrder(batch.map(getExecutionFunction))(
      ...args,
    );
    if (result instanceof Promise) {
      state.onAsyncStart();
      return result.then(() => state.onSucceeded()).catch(onError);
    }
    const succeeded = state.onSucceeded();
    return succeeded instanceof Promise ? succeeded.then(() => result) : result;
  } catch (error) {
    return onError(error);
  }
};

/*
 * Reported, not rethrown: the call arrives from a host event listener, where a
 * rethrow is an error the app cannot catch. The failed state is the feedback.
 */
const reportError = (error: unknown): void => console.error(error);

const execute = (action: ActionModel, args: unknown[]): void => {
  const run = callFunctionsInOrder(
    getBatches(action).map((batch) => () => executeBatch(action, batch, args)),
  );

  try {
    const result = run();
    if (result instanceof Promise) {
      result.catch(reportError);
    }
  } catch (error) {
    reportError(error);
  }
};

/**
 * Runs something when the button inside it is pressed, and shows how it went.
 *
 * Flow's `Action`, rebuilt: the same state machine (from
 * `@mittwald/flow-components-base`), the same nesting — an action runs its
 * parents after itself — and the same overlay props. What it has not got is the
 * confirmation modal (`slot="actionConfirm"`).
 */
export const Action = defineComponent({
  name: "Action",

  props: actionProps,

  setup(props, { slots }) {
    const model: ActionModel = {
      props,
      parent: inject(actionKey, undefined),
      state: new ActionState(),
      overlayContext: injectOverlayContext(),
    };
    provide(actionKey, model);

    const state = watchMobxValue(() => model.state.state);
    const run = dynamic((...args: unknown[]) => execute(model, args));

    return () => {
      const states = {
        isPending: state.value === "isPending",
        isSucceeded: state.value === "isSucceeded",
        isFailed: state.value === "isFailed",
        "aria-disabled": state.value === "isExecuting",
      };

      return mapChildren(slots.default?.(), (child) =>
        child.type === Button
          ? { ...states, onPress: run }
          : child.type === MenuItem
            ? { ...states, onAction: run }
            : child.type === Link
              ? { onPress: run }
              : undefined,
      );
    };
  },
});

composition(Action);

export default Action;
