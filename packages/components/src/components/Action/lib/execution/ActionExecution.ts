import type { ActionState } from "@/components/Action/lib/execution/ActionState";
import { isBreakActionError } from "@/components/Action/lib/execution/breakAction";

const duration = {
  pending: 1000,
  succeeded: 1500,
  failed: 2000,
};

interface ActionExecutionOptions {
  showFeedback?: boolean;
  resetAfterDone?: boolean;
  onFeedbackDone?: (...args: unknown[]) => void;
}

export class ActionExecution {
  private readonly options: Required<ActionExecutionOptions>;
  private readonly state: ActionState;
  private readonly args: unknown[];
  private isDone = false;
  public error: unknown;

  public constructor(
    state: ActionState,
    args: unknown[],
    options: ActionExecutionOptions = {},
  ) {
    const {
      resetAfterDone = true,
      onFeedbackDone = () => {
        // default: do nothing
      },
      showFeedback = false,
    } = options;

    this.state = state;
    this.args = args;
    this.options = { resetAfterDone, onFeedbackDone, showFeedback };
  }

  public onAsyncStart(): void {
    this.options.showFeedback = true;
    this.state.updateState("isExecuting");
    setTimeout(() => this.startPending(), duration.pending);
  }

  public onSucceeded(): void {
    this.onDone();
  }

  public onFailed(error: unknown): void {
    this.error = error ?? new Error("Unknown error");
    console.error(error);
    this.onDone();
  }

  private startFailedFeedback(): void {
    if (isBreakActionError(this.error)) {
      this.resetAfterDone();
    } else {
      this.state.updateState("isFailed");
      setTimeout(() => this.resetAfterDone(), duration.failed);
    }
  }

  private startSucceededFeedback(): void {
    this.state.updateState("isSucceeded");
    setTimeout(() => this.resetAfterDone(), duration.succeeded);
  }

  private resetAfterDone(): void {
    if (this.options.resetAfterDone) {
      this.state.updateState("isIdle");
    }
    if (!this.error) {
      this.options.onFeedbackDone(...this.args);
    }
  }

  private onDone(): void {
    this.isDone = true;

    if (this.options.showFeedback) {
      if (this.error) {
        this.startFailedFeedback();
      } else {
        this.startSucceededFeedback();
      }
    } else {
      this.resetAfterDone();
    }
  }

  private startPending(): void {
    if (!this.isDone) {
      this.state.updateState("isPending");
    }
  }
}
