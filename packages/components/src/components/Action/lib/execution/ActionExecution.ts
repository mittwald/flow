import type { ActionState } from "@/components/Action/lib/execution/ActionState";
import { sleep } from "@/lib/promises/sleep";

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

  public onSucceeded(): Promise<void> {
    return this.onDone();
  }

  public async onFailed(error: unknown): Promise<void> {
    this.error = error ?? new Error("Unknown error");
    console.error(error);
    await this.onDone();
  }

  private async startFailedFeedback(): Promise<void> {
    this.state.updateState("isFailed");
    await sleep(duration.failed);
    this.resetAfterDone();
  }

  private async startSucceededFeedback(): Promise<void> {
    this.state.updateState("isSucceeded");
    await sleep(duration.succeeded);
    this.resetAfterDone();
  }

  private resetAfterDone(): void {
    if (this.options.resetAfterDone) {
      this.state.updateState("isIdle");
    }
    if (!this.error) {
      this.options.onFeedbackDone(...this.args);
    }
  }

  private async onDone(): Promise<void> {
    this.isDone = true;

    if (this.options.showFeedback) {
      if (this.error) {
        await this.startFailedFeedback();
      } else {
        await this.startSucceededFeedback();
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
