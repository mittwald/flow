import { action, makeObservable, observable } from "mobx";
import { useState } from "react";
import useSelector from "@/lib/mobx/useSelector";

interface Options {
  feedback?: boolean;
}

const duration = {
  pending: 1000,
  succeeded: 1500,
  failed: 2000,
};

export type ObservedActionState = Pick<
  ActionState,
  "isSucceeded" | "isPending" | "isExecuting" | "isFailed"
>;

export class ActionState {
  public isPending = false;
  public isExecuting = false;
  public isSucceeded = false;
  public isFailed = false;
  private readonly feedback: boolean;
  private executionCount = 0;

  private constructor(options: Options = {}) {
    const { feedback = false } = options;

    makeObservable(this, {
      isPending: observable,
      isExecuting: observable,
      isSucceeded: observable,
      isFailed: observable,
      onStart: action.bound,
      onSucceeded: action.bound,
      onFailed: action.bound,
      resetFeedback: action.bound,
      startPending: action.bound,
    });

    this.feedback = feedback;
  }

  public static useNew(opts?: Options): ActionState {
    return useState(new ActionState(opts))[0];
  }

  public resetFeedback(): void {
    this.isFailed = false;
    this.isSucceeded = false;
  }

  private startFailedFeedback(): void {
    if (!this.feedback) {
      return;
    }

    this.isFailed = true;
    setTimeout(this.resetFeedback, duration.failed);
  }

  private startSucceededFeedback(): void {
    if (!this.feedback) {
      return;
    }

    this.isSucceeded = true;
    setTimeout(this.resetFeedback, duration.succeeded);
  }

  private onDone(succeeded: boolean) {
    this.isExecuting = false;
    this.isPending = false;

    if (succeeded) {
      this.startSucceededFeedback();
    } else {
      this.startFailedFeedback();
    }
  }

  public onFailed(): void {
    this.onDone(false);
  }

  public onSucceeded(): void {
    this.onDone(true);
  }

  public startPending(forExecutionCount: number): void {
    if (this.isExecuting && forExecutionCount === this.executionCount) {
      this.isPending = true;
    }
  }

  public onStart(): void {
    const executionCount = ++this.executionCount;
    this.isExecuting = true;
    setTimeout(() => this.startPending(executionCount), duration.pending);
  }

  public useObserve(): ObservedActionState {
    return useSelector(
      () => ({
        isPending: this.isPending,
        isFailed: this.isFailed,
        isExecuting: this.isExecuting,
        isSucceeded: this.isSucceeded,
      }),
      [this],
    );
  }
}
