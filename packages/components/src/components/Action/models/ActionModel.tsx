import { useContext } from "react";
import type { OverlayController } from "@/lib/controller";
import { useOverlayController } from "@/lib/controller";
import invariant from "invariant";
import type { ActionProps } from "@/components/Action/types";
import { actionContext } from "@/components/Action/context";
import { ActionState } from "@/components/Action/models/ActionState";
import { ActionExecution } from "@/components/Action/models/ActionExecution";

interface InitObject {
  actionProps: ActionProps;
  parentAction?: ActionModel;
  confirmationModalController: OverlayController;
  needsConfirmation: boolean;
  overlayController: OverlayController;
  state: ActionState;
}

export class ActionModel {
  public state: ActionState;
  public needsConfirmation: boolean;
  public readonly actionProps: ActionProps;
  public readonly parentAction?: ActionModel;
  public readonly confirmationModalController: OverlayController;
  public readonly overlayController: OverlayController;

  private constructor(init: InitObject) {
    const {
      actionProps,
      needsConfirmation,
      parentAction,
      overlayController,
      confirmationModalController,
      state,
    } = init;

    this.actionProps = actionProps;
    this.parentAction = parentAction;
    this.confirmationModalController = confirmationModalController;
    this.needsConfirmation = needsConfirmation;
    this.overlayController = overlayController;
    this.state = state;
  }

  public static useNew(
    actionProps: ActionProps,
    init: Partial<InitObject> = {},
  ): ActionModel {
    const parentAction = useContext(actionContext);
    const overlayController = useOverlayController();
    const confirmationModalController = useOverlayController();
    const state = ActionState.useNew();

    return new ActionModel({
      parentAction,
      overlayController,
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
    return c;
  }

  public static useConfirmationAction(): ActionModel {
    const action = ActionModel.use();
    return new ActionModel({
      actionProps: action.actionProps,
      confirmationModalController: action.confirmationModalController,
      overlayController: action.overlayController,
      state: action.state,
      needsConfirmation: false,
      parentAction: ActionModel.useNew(
        {
          closeOverlay: true,
        },
        {
          parentAction: action.parentAction,
        },
      ),
    });
  }

  public getOverlayController(): OverlayController | undefined {
    const getController = (
      controller?: OverlayController | boolean,
    ): OverlayController | undefined => {
      return controller === undefined
        ? undefined
        : controller === true
          ? this.overlayController
          : controller === false
            ? undefined
            : controller;
    };

    return (
      getController(this.actionProps.openOverlay) ??
      getController(this.actionProps.closeOverlay) ??
      getController(this.actionProps.toggleOverlay)
    );
  }

  public execute = (...args: unknown[]): void => {
    new ActionExecution(this).execute(...args);
  };
}
