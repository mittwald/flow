import { action, computed, makeObservable, observable } from "mobx";

export type ActionStateValue =
  "isIdle" | "isSucceeded" | "isPending" | "isExecuting" | "isFailed";

/** How long each state lasts, in ms. */
export const actionStateDurations = {
  /** An async action counts as pending only after this long. */
  pending: 1000,
  succeeded: 800,
  failed: 2000,
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * What an `Action` shows on its button: executing, pending, then succeeded or
 * failed for a moment, then idle again.
 *
 * A synchronous action shows success only with `showFeedback`, an async one
 * unless `showFeedback` is `false`. A failure is shown either way.
 */
export class ActionState {
  private showFeedback?: boolean;
  public state: ActionStateValue = "isIdle";
  private setPendingTimeout: ReturnType<typeof setTimeout> | undefined;
  public error: unknown;
  private isAsync = false;

  public constructor() {
    makeObservable(this, {
      state: observable,
      updateState: action,
      isBusy: computed,
    });
  }

  public updateState(newState: ActionStateValue): void {
    this.state = newState;
  }

  public get isBusy(): boolean {
    return this.state !== "isIdle";
  }

  public onAsyncStart(): void {
    this.clearPendingTimeout();
    this.isAsync = true;
    this.updateState("isExecuting");
    this.setPendingTimeout = setTimeout(
      () => this.startPending(),
      actionStateDurations.pending,
    );
  }

  public async onSucceeded(): Promise<void> {
    await this.onDone();
  }

  public async onFailed(error?: unknown): Promise<void> {
    this.error = error ?? new Error("Unknown error");
    await this.onDone();
  }

  public withFeedback(feedback?: boolean): this {
    this.showFeedback = feedback;
    return this;
  }

  private async startFailedFeedback(): Promise<void> {
    this.updateState("isFailed");
    await sleep(actionStateDurations.failed);
    this.resetAfterDone();
  }

  private async startSucceededFeedback(): Promise<void> {
    this.updateState("isSucceeded");
    await sleep(actionStateDurations.succeeded);
    this.resetAfterDone();
  }

  private resetAfterDone(): void {
    this.updateState("isIdle");
    this.isAsync = false;
    this.error = undefined;
  }

  private clearPendingTimeout(): void {
    if (this.setPendingTimeout) {
      clearTimeout(this.setPendingTimeout);
    }
  }

  private onDone(): Promise<void> | void {
    this.clearPendingTimeout();
    if (this.error) {
      return this.startFailedFeedback();
    } else if (
      this.showFeedback !== false &&
      (this.showFeedback || this.isAsync)
    ) {
      return this.startSucceededFeedback();
    } else {
      this.resetAfterDone();
    }
  }

  private startPending(): void {
    this.updateState("isPending");
  }
}

export default ActionState;
