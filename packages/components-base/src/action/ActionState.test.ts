import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ActionState, actionStateDurations } from "./ActionState";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ActionState", () => {
  test("stays idle after a synchronous action", async () => {
    const state = new ActionState().withFeedback(undefined);

    await state.onSucceeded();

    expect(state.state).toBe("isIdle");
  });

  test("shows success after a synchronous action with showFeedback", async () => {
    const state = new ActionState().withFeedback(true);

    const done = state.onSucceeded();
    expect(state.state).toBe("isSucceeded");

    await vi.advanceTimersByTimeAsync(actionStateDurations.succeeded);
    await done;
    expect(state.state).toBe("isIdle");
  });

  test("becomes pending only after the delay", async () => {
    const state = new ActionState();

    state.onAsyncStart();
    expect(state.state).toBe("isExecuting");

    await vi.advanceTimersByTimeAsync(actionStateDurations.pending);
    expect(state.state).toBe("isPending");
  });

  test("shows success after an async action, unless showFeedback is false", async () => {
    const withFeedback = new ActionState();
    withFeedback.onAsyncStart();
    void withFeedback.onSucceeded();
    expect(withFeedback.state).toBe("isSucceeded");

    const withoutFeedback = new ActionState().withFeedback(false);
    withoutFeedback.onAsyncStart();
    await withoutFeedback.onSucceeded();
    expect(withoutFeedback.state).toBe("isIdle");
  });

  test("shows a failure and resets afterwards", async () => {
    const state = new ActionState();

    const done = state.onFailed(new Error("Shields are down"));
    expect(state.state).toBe("isFailed");

    await vi.advanceTimersByTimeAsync(actionStateDurations.failed);
    await done;
    expect(state.state).toBe("isIdle");
    expect(state.error).toBeUndefined();
  });
});
