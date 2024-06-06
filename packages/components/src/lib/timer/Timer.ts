import type { DurationLike } from "luxon";
import { DateTime, Duration } from "luxon";

export class Timer {
  private duration: Duration = Duration.fromDurationLike(0);
  private onDone: (() => void) | undefined;

  private startedAt?: DateTime;
  private pausedAt?: DateTime;
  private runningTimeoutId?: number;

  public start(duration: DurationLike, onDone?: () => void): void {
    if (this.startedAt) {
      throw new Error("Timer already started");
    }

    this.duration = Duration.fromDurationLike(duration);
    this.onDone = onDone;
    this.startTimeout(this.duration);
  }

  public restart(): void {
    this.stop();
    this.startTimeout(this.duration);
  }

  public pause(): void {
    this.clearTimeout();
    const now = DateTime.now();
    this.pausedAt = now;
    if (!this.startedAt) {
      this.startedAt = now;
    }
  }

  public resume(): void {
    if (!this.startedAt) {
      throw new Error("Timer not paused");
    } else if (this.pausedAt) {
      const elapsed = this.pausedAt.diff(this.startedAt);
      const remainingDuration = this.duration.minus(elapsed);
      this.startTimeout(remainingDuration);
    }
  }

  public stop(): void {
    this.clearTimeout();
    this.startedAt = undefined;
    this.pausedAt = undefined;
  }

  public get state(): "idle" | "running" | "paused" {
    return this.pausedAt ? "paused" : this.startedAt ? "running" : "idle";
  }

  private clearTimeout(): void {
    if (this.runningTimeoutId) {
      window.clearTimeout(this.runningTimeoutId);
    }
    this.runningTimeoutId = undefined;
  }

  private startTimeout(duration: Duration): void {
    this.startedAt = DateTime.now();
    this.pausedAt = undefined;
    this.runningTimeoutId = window.setTimeout(() => {
      this.stop();
      if (this.onDone) {
        this.onDone();
      }
    }, duration.toMillis());
  }
}

export default Timer;
