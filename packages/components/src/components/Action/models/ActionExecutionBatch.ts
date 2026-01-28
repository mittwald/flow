import type { ActionModel } from "@/components/Action/models/ActionModel";
import { callFunctionsInOrder } from "@/lib/promises/callFunctionsInOrder";
import { getExecutionFunction } from "@/components/Action/models/getExecutionFunction";

export class ActionExecutionBatch {
  private readonly actions: ActionModel[] = [];
  public readonly baseAction: ActionModel;

  constructor(baseAction: ActionModel) {
    this.baseAction = baseAction;
  }

  public addAction(action: ActionModel): void {
    this.actions.push(action);
  }

  public executeBatch(...args: unknown[]) {
    if (this.actions.length === 0) {
      return;
    }

    const batchFeedback =
      this.actions[this.actions.length - 1]?.actionProps.showFeedback;

    const executionState = this.baseAction.state.withFeedback(
      this.baseAction.needsConfirmation ? false : batchFeedback,
    );

    const executionFunctions = this.actions.map((c) => getExecutionFunction(c));

    const executeBatch = callFunctionsInOrder(executionFunctions);

    const onError = (error: unknown): void => {
      executionState.onFailed(error);
      throw error;
    };

    const onSucceeded = () => {
      return executionState.onSucceeded();
    };

    try {
      const result = executeBatch(...args);
      if (result instanceof Promise) {
        executionState.onAsyncStart();
        return result.then(onSucceeded).catch(onError);
      } else {
        onSucceeded();
        return result;
      }
    } catch (error) {
      onError(error);
    }
  }
}
