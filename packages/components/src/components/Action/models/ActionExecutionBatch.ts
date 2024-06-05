import type { ActionModel } from "@/components/Action/models/ActionModel";
import { callFunctionsInOrder } from "@/lib/promises/callFunctionsInOrder";
import { callAndReact } from "@/lib/promises/callAndReact";
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

  public async executeBatch(args: unknown[]) {
    if (this.actions.length === 0) {
      return;
    }

    const batchFeedback =
      this.actions[this.actions.length - 1].actionProps.showFeedback;

    const executionState = this.baseAction.state.withFeedback(
      this.baseAction.needsConfirmation ? false : batchFeedback,
    );

    const executionFunctions = this.actions.map((c) => getExecutionFunction(c));

    const executeBatch = callFunctionsInOrder(executionFunctions);

    let caughtError: unknown;

    await callAndReact(() => executeBatch(...args), {
      onAsync: () => executionState.onAsyncStart(),
      then: () => executionState.onSucceeded(),
      catch: (error) => {
        executionState.onFailed(error);
        caughtError = error;
      },
    });

    if (caughtError) {
      throw caughtError;
    }
  }
}
