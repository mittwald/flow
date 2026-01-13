import {
  action as mobxAction,
  computed,
  makeObservable,
  observable,
} from "mobx";
import useSelector from "@/lib/mobx/useSelector";
import { sleep } from "@/lib/promises/sleep";
import { useStatic } from "@/lib/hooks/useStatic";

export type ActionStateValue =
  | "isIdle"
  | "isSucceeded"
  | "isPending"
  | "isExecuting"
  | "isFailed";

export const duration = {
  pending: 1000,
  succeeded: 1500,
  failed: 2000,
};

export class ActionState {
  private showFeedback?: boolean;
  public state: ActionStateValue = "isIdle";
  private setPendingTimeout: number | undefined;
  public error: unknown;
  private isAsync = false;

  public constructor() {
    makeObservable(this, {
      state: observable,
      updateState: mobxAction,
      isBusy: computed,
    });
  }

  public static useNew(): ActionState {
    return useStatic(() => new ActionState());
  }

  public updateState(newState: ActionStateValue): void {
    this.state = newState;
  }

  public useValue(): ActionStateValue {
    return useSelector(() => this.state, [this]);
  }

  public useIsBusy(): boolean {
    return useSelector(() => this.isBusy, [this]);
  }

  public get isBusy(): boolean {
    return this.state !== "isIdle";
  }

  public onAsyncStart(): void {
    this.isAsync = true;
    this.updateState("isExecuting");
    this.setPendingTimeout = window.setTimeout(
      () => this.startPending(),
      duration.pending,
    );
  }

  public async onSucceeded(): Promise<void> {
    await this.onDone();
  }

  public async onFailed(error?: unknown): Promise<void> {
    this.error = error ?? new Error("Unknown error");
    await this.onDone();
  }

  public withFeedback(feedback?: boolean): ActionState {
    this.showFeedback = feedback;
    return this;
  }

  private async startFailedFeedback(): Promise<void> {
    this.updateState("isFailed");
    await sleep(duration.failed);
    this.resetAfterDone();
  }

  private async startSucceededFeedback(): Promise<void> {
    this.updateState("isSucceeded");
    await sleep(duration.succeeded);
    this.resetAfterDone();
  }

  private resetAfterDone(): void {
    this.updateState("isIdle");
    this.isAsync = false;
    this.error = undefined;
  }

  private async onDone(): Promise<void> {
    if (this.setPendingTimeout) {
      window.clearTimeout(this.setPendingTimeout);
    }
    if (this.error) {
      await this.startFailedFeedback();
    } else if (
      this.showFeedback !== false &&
      (this.showFeedback || this.isAsync)
    ) {
      await this.startSucceededFeedback();
    } else {
      this.resetAfterDone();
    }
  }

  private startPending(): void {
    this.updateState("isPending");
  }
}
