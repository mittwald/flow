import { expect, test } from "vitest";
import { renderHook } from "vitest-browser-react";
import type { ActionStateValue } from "@/components/Action/models/ActionState";
import type { ActionProps } from "@/components/Action";
import { ActionModel } from "@/components/Action/models/ActionModel";
import { ActionExecutionBatch } from "@/components/Action/models/ActionExecutionBatch";
import { autorun } from "mobx";
import { sleep } from "@/lib/promises/sleep";

vi.useFakeTimers({});

const runTest = async (
  actionProps: ActionProps,
  expectedStates: ActionStateValue[],
): Promise<void> => {
  const { result: action } = await renderHook(() =>
    ActionModel.useNew(actionProps),
  );

  const execution = new ActionExecutionBatch(action.current);
  const actionState = action.current.state;

  const states: ActionStateValue[] = [];
  autorun(() => {
    states.push(actionState.state);
  });

  execution.addAction(action.current);
  void execution.executeBatch([]).catch(() => {
    // do nothing
  });
  await vi.runAllTimersAsync();

  expect(states).toEqual(expectedStates);
};

test("State for async actions is correct", async () => {
  await runTest(
    {
      action: () => sleep(500),
    },
    ["isIdle", "isExecuting", "isSucceeded", "isIdle"],
  );
});

test("State for async failing actions is correct", async () => {
  await runTest(
    {
      action: async () => {
        await sleep(500);
        throw new Error("Wuhaa");
      },
    },
    ["isIdle", "isExecuting", "isFailed", "isIdle"],
  );
});

test("Long running actions show pending state", async () => {
  await runTest(
    {
      action: () => sleep(1500),
    },
    ["isIdle", "isExecuting", "isPending", "isSucceeded", "isIdle"],
  );
});

test("Sync action stays idle", async () => {
  await runTest(
    {
      action: () => {
        // empty
      },
    },
    ["isIdle"],
  );
});

test("Sync action show feedback when activated", async () => {
  await runTest(
    {
      action: () => {
        // empty
      },
      showFeedback: true,
    },
    ["isIdle", "isSucceeded", "isIdle"],
  );
});

test("Sync failing action show feedback when activated", async () => {
  await runTest(
    {
      action: () => {
        throw new Error("Wuhaa");
      },
    },
    ["isIdle", "isFailed", "isIdle"],
  );
});
