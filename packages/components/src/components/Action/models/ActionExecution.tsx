import type { ActionModel } from "@/components/Action/models/ActionModel";
import { ActionExecutionBatch } from "@/components/Action/models/ActionExecutionBatch";

export class ActionExecution {
  private readonly action: ActionModel;

  public constructor(action: ActionModel) {
    this.action = action;
  }

  public execute = (...args: unknown[]): void => {
    const batches = this.getBatchedActions();

    const executeAllBatches = async () => {
      for (const batch of batches) {
        await batch.executeBatch(args);
      }
    };

    void executeAllBatches().catch((error) => console.error(error));
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
