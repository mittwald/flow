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
import type { FlowComponentName } from "@/components/propTypes";

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

  public getOverlayController(
    from: FlowComponentName | OverlayController,
  ): OverlayController | undefined {
    const getController = (
      controller?: OverlayController | FlowComponentName,
    ): OverlayController | undefined => {
      if (controller === undefined) {
        return undefined;
      }
      if (from instanceof OverlayController) {
        return from;
      }
      if (typeof from === "string") {
        return this.overlayContext[from];
      }
    };

    return (
      getController(this.actionProps.openOverlay) ??
      getController(this.actionProps.closeOverlay) ??
      getController(this.actionProps.toggleOverlay) ??
      getController(this.actionProps.openModal ? "Modal" : undefined) ??
      getController(this.actionProps.closeModal ? "Modal" : undefined) ??
      getController(this.actionProps.toggleModal ? "Modal" : undefined)
    );
  }

  public execute = (...args: unknown[]): void => {
    new ActionExecution(this).execute(...args);
  };
}
