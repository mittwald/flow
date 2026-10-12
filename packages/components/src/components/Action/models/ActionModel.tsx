import { useContext } from "react";
import { OverlayController } from "@/lib/controller";
import invariant from "invariant";
import { type ActionProps } from "@/components/Action/types";
import { actionContext } from "@/components/Action/context";
import { ActionState } from "@/components/Action/models/ActionState";
import { ActionExecution } from "@/components/Action/models/ActionExecution";
import { ActionStateContext } from "@/components/Action/models/ActionStateContext";
import type { OverlayContext } from "@/lib/controller/overlay/context";
import { useOverlayContext } from "@/lib/controller/overlay/context";
import type { OverlayReference } from "@/lib/controller/overlay/OverlayController";

interface InitObject {
  actionProps: ActionProps;
  parentAction?: ActionModel;
  confirmationModalController: OverlayController;
  needsConfirmation: boolean;
  overlayContext: OverlayContext;
  state: ActionState;
}

export class ActionModel {
  public state: ActionState;
  public needsConfirmation: boolean;
  public readonly actionProps: ActionProps;
  public readonly parentAction?: ActionModel;
  public readonly confirmationModalController: OverlayController;
  public readonly overlayContext: OverlayContext;

  private constructor(init: InitObject) {
    const {
      actionProps,
      needsConfirmation,
      parentAction,
      overlayContext,
      confirmationModalController,
      state,
    } = init;

    this.actionProps = actionProps;
    this.parentAction = parentAction;
    this.confirmationModalController = confirmationModalController;
    this.needsConfirmation = needsConfirmation;
    this.overlayContext = overlayContext;
    this.state = state;
  }

  public static useNew(
    actionProps: ActionProps,
    init: Partial<InitObject> = {},
  ): ActionModel {
    const parentAction = useContext(actionContext);
    const overlayContext = useOverlayContext();
    const confirmationModalController = OverlayController.useNew();
    const state = ActionState.useNew();

    return new ActionModel({
      parentAction,
      overlayContext,
      confirmationModalController,
      needsConfirmation: false,
      actionProps,
      state,
      ...init,
    });
  }

  public static use(): ActionModel {
    const c = useContext(actionContext);
    invariant(!!c, "Action context is not defined");
    ActionStateContext.useRegisterState(c.state);
    return c;
  }

  public static useConfirmationAction(): ActionModel {
    const action = ActionModel.use();

    return new ActionModel({
      actionProps: action.actionProps,
      confirmationModalController: action.confirmationModalController,
      overlayContext: action.overlayContext,
      state: action.state,
      needsConfirmation: false,
      parentAction: ActionModel.useNew(
        {
          closeOverlay: action.confirmationModalController,
        },
        {
          parentAction: action.parentAction,
        },
      ),
    });
  }

  /**
   * Resolves an overlay reference against this action's overlay context.
   *
   * Returns `undefined` unless the action carries one of the overlay props –
   * `Action` relies on that to tell whether it owns a surrounding `Modal`'s
   * controller.
   */
  public getOverlayController(
    from: OverlayReference,
  ): OverlayController | undefined {
    return this.hasOverlayProps
      ? this.resolveOverlayReference(from)
      : undefined;
  }

  private get hasOverlayProps(): boolean {
    const {
      openOverlay,
      closeOverlay,
      toggleOverlay,
      openModal,
      closeModal,
      toggleModal,
    } = this.actionProps;

    return [
      openOverlay,
      closeOverlay,
      toggleOverlay,
      openModal,
      closeModal,
      toggleModal,
    ].some(Boolean);
  }

  private resolveOverlayReference(
    from: OverlayReference,
  ): OverlayController | undefined {
    if (from instanceof OverlayController) {
      return from;
    }
    if (typeof from === "string") {
      return this.overlayContext.byType[from];
    }
    // `true` and options without an `overlay` both mean "the nearest one".
    if (from === true || !("overlay" in from) || from.overlay === undefined) {
      return this.overlayContext.nearest;
    }
    return this.resolveOverlayReference(from.overlay);
  }

  public static getCloseOverlayOptions = (options?: OverlayReference) => {
    if (
      options === undefined ||
      options instanceof OverlayController ||
      typeof options === "string" ||
      options === true
    ) {
      return undefined;
    }
    return options;
  };

  public execute = (...args: unknown[]): void => {
    new ActionExecution(this).execute(...args);
  };
}
