import type { ActionModel } from "@/components/Action/models/ActionModel";
import { ActionExecutionBatch } from "@/components/Action/models/ActionExecutionBatch";
import { callFunctionsInOrder } from "@/lib/promises/callFunctionsInOrder";
import { MutedActionError } from "@/components/Action/MutedActionError";

export class ActionExecution {
  private readonly action: ActionModel;

  public constructor(action: ActionModel) {
    this.action = action;
  }

  public execute = (...args: unknown[]): void => {
    const batches = this.getBatchedActions();

    const executeBatchedActions = callFunctionsInOrder(
      batches.map((b) => b.executeBatch.bind(b)),
    );

    try {
      const maybePromise = executeBatchedActions(...args);
      if (maybePromise instanceof Promise) {
        maybePromise.catch((error) => {
          MutedActionError.rethrowIfNotMuted(error);
        });
      }
    } catch (error) {
      MutedActionError.rethrowIfNotMuted(error);
    }
  };

  private getBatchedActions = (): ActionExecutionBatch[] => {
    let currentAction: ActionModel | undefined = this.action;

    const batches: ActionExecutionBatch[] = [];
    let currentBatch: ActionExecutionBatch = new ActionExecutionBatch(
      this.action,
    );

    let skipCount = 0;

    while (currentAction) {
      const { onAction, break: $break, skip } = currentAction.actionProps;

      if (currentAction.needsConfirmation) {
        currentBatch.addAction(currentAction);
        break;
      }

      if (skip) {
        skipCount = skip === true ? 1 : skip;
        currentAction = currentAction.parentAction;
        continue;
      }

      if (skipCount > 0) {
        currentAction = currentAction.parentAction;
        skipCount--;
        continue;
      }

      if ($break) {
        break;
      }

      if (onAction) {
        currentBatch.addAction(currentAction);
      } else {
        batches.push(currentBatch);
        currentBatch = new ActionExecutionBatch(this.action);
        currentBatch.addAction(currentAction);
      }

      currentAction = currentAction.parentAction;
    }

    batches.push(currentBatch);
    return batches;
  };
}
