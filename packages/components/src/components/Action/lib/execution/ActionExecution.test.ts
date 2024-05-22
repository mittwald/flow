import { expect, test } from "vitest";
import { ActionExecution } from "@/components/Action/lib/execution/ActionExecution";
import { ActionState } from "@/components/Action/lib/execution/ActionState";
import { renderHook } from "@testing-library/react";

vi.useFakeTimers({});

test("State for async actions is correct", async () => {
  const actionState = renderHook(() => ActionState.useNew()).result.current;
  const execution = new ActionExecution(actionState, [], {
    showFeedback: false,
  });

  expect(actionState.state).toBe("isIdle");
  execution.onAsyncStart();
  expect(actionState.state).toBe("isExecuting");
  void execution.onSucceeded();
  expect(actionState.state).toBe("isSucceeded");
  await vi.runAllTimersAsync();
  expect(actionState.state).toBe("isIdle");
});

test("State for async failing actions is correct", async () => {
  const actionState = renderHook(() => ActionState.useNew()).result.current;
  const execution = new ActionExecution(actionState, [], {
    showFeedback: false,
  });

  expect(actionState.state).toBe("isIdle");
  execution.onAsyncStart();
  expect(actionState.state).toBe("isExecuting");
  void execution.onFailed("Error");
  expect(actionState.state).toBe("isFailed");
  await vi.runAllTimersAsync();
  expect(actionState.state).toBe("isIdle");
});

test("Long running actions show pending state", async () => {
  const actionState = renderHook(() => ActionState.useNew()).result.current;
  const execution = new ActionExecution(actionState, [], {
    showFeedback: false,
  });

  expect(actionState.state).toBe("isIdle");
  execution.onAsyncStart();
  expect(actionState.state).toBe("isExecuting");
  vi.advanceTimersByTime(1001);
  expect(actionState.state).toBe("isPending");
  void execution.onSucceeded();
  expect(actionState.state).toBe("isSucceeded");
  await vi.runAllTimersAsync();
  expect(actionState.state).toBe("isIdle");
});

test("State is not reset when option enabled", async () => {
  const actionState = renderHook(() => ActionState.useNew()).result.current;
  const execution = new ActionExecution(actionState, [], {
    resetAfterDone: false,
  });

  expect(actionState.state).toBe("isIdle");
  execution.onAsyncStart();
  expect(actionState.state).toBe("isExecuting");
  void execution.onSucceeded();
  expect(actionState.state).toBe("isSucceeded");
  await vi.runAllTimersAsync();
  expect(actionState.state).toBe("isSucceeded");
});

test("onFeedbackDone() callback is called", async () => {
  const actionState = renderHook(() => ActionState.useNew()).result.current;
  const onFeedbackDone = vi.fn();

  const execution = new ActionExecution(actionState, [], {
    onFeedbackDone,
  });

  expect(actionState.state).toBe("isIdle");
  execution.onAsyncStart();
  expect(onFeedbackDone).toHaveBeenCalledTimes(0);
  expect(actionState.state).toBe("isExecuting");
  void execution.onSucceeded();
  expect(onFeedbackDone).toHaveBeenCalledTimes(0);
  expect(actionState.state).toBe("isSucceeded");
  await vi.runAllTimersAsync();
  expect(actionState.state).toBe("isIdle");
  expect(onFeedbackDone).toHaveBeenCalledTimes(1);
});

test("Sync action stays idle", async () => {
  const actionState = renderHook(() => ActionState.useNew()).result.current;
  const execution = new ActionExecution(actionState, [], {
    showFeedback: false,
  });

  expect(actionState.state).toBe("isIdle");
  void execution.onSucceeded();
  expect(actionState.state).toBe("isIdle");
});

test("Sync action show feedback when activated", async () => {
  const actionState = renderHook(() => ActionState.useNew()).result.current;
  const execution = new ActionExecution(actionState, [], {
    showFeedback: true,
  });

  expect(actionState.state).toBe("isIdle");
  void execution.onSucceeded();
  expect(actionState.state).toBe("isSucceeded");
  await vi.runAllTimersAsync();
  expect(actionState.state).toBe("isIdle");
});

test("Sync failing action show feedback when activated", async () => {
  const actionState = renderHook(() => ActionState.useNew()).result.current;
  const execution = new ActionExecution(actionState, [], {
    showFeedback: true,
  });

  expect(actionState.state).toBe("isIdle");
  void execution.onFailed("Error");
  expect(actionState.state).toBe("isFailed");
  await vi.runAllTimersAsync();
  expect(actionState.state).toBe("isIdle");
});
