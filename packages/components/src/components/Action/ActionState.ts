import { makeObservable, observable, runInAction } from "mobx";
import { useRef } from "react";
import useSelector from "@/lib/mobx/useSelector";

interface Options {
  feedback?: boolean;
}

const duration = {
  pending: 1000,
  succeeded: 1500,
  failed: 2000,
};

export type ActionStateValue =
  | "isIdle"
  | "isSucceeded"
  | "isPending"
  | "isExecuting"
  | "isFailed";

export class ActionState {
  private readonly feedback: boolean;
  private executionCount = 0;
  public state: ActionStateValue = "isIdle";

  private constructor(options: Options = {}) {
    const { feedback = false } = options;
    this.feedback = feedback;

    makeObservable(this, {
      state: observable,
    });
  }

  public static useNew(opts?: Options): ActionState {
    return useRef(new ActionState(opts)).current;
  }

  public onAsyncStart(): void {
    const executionCount = ++this.executionCount;
    this.updateState("isExecuting");
    setTimeout(() => this.startPending(executionCount), duration.pending);
  }

  public onSucceeded(): void {
    this.onDone(true);
  }

  public onFailed(): void {
    this.onDone(false);
  }

  private updateState(newState: ActionStateValue): void {
    runInAction(() => {
      this.state = newState;
    });
  }

  private startFailedFeedback(): void {
    this.updateState("isFailed");
    setTimeout(() => this.updateState("isIdle"), duration.failed);
  }

  private startSucceededFeedback(): void {
    this.updateState("isSucceeded");
    setTimeout(() => this.updateState("isIdle"), duration.succeeded);
  }

  private onDone(succeeded: boolean): void {
    if (!this.feedback) {
      this.updateState("isIdle");
      return;
    }

    if (succeeded) {
      this.startSucceededFeedback();
    } else {
      this.startFailedFeedback();
    }
  }

  private startPending(forExecutionCount: number): void {
    if (
      this.state === "isExecuting" &&
      forExecutionCount === this.executionCount
    ) {
      this.updateState("isPending");
    }
  }

  public useState(): ActionStateValue {
    return useSelector(() => this.state, [this]);
  }
}
