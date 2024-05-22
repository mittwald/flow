import { expect, test, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useActionController } from "@/components/Action/lib/execution/useActionController";
import React from "react";
import { Action } from "@/components/Action";

test("callAction() basically starts action handling", () => {
  const actionFn = vi.fn();

  const controller = renderHook(() => useActionController(), {
    wrapper: (props) => (
      <Action showFeedback action={actionFn}>
        {props.children}
      </Action>
    ),
  }).result.current;

  expect(controller.state.state).toBe("isIdle");
  controller.execute();
  expect(actionFn).toHaveBeenCalledOnce();
  expect(controller.state.state).toBe("isSucceeded");
});

test("parent actions are called after local action", () => {
  const history: string[] = [];
  const actionFn = vi.fn(() => history.push("local"));
  const parentActionFn = vi.fn(() => history.push("parent"));

  const controller = renderHook(() => useActionController(), {
    wrapper: (props) => (
      <Action action={parentActionFn}>
        <Action action={actionFn} showFeedback>
          {props.children}
        </Action>
      </Action>
    ),
  }).result.current;

  controller.execute();
  expect(history.join()).toBe("local,parent");
});

test("break actions stopping calls of parent actions", () => {
  const history: string[] = [];
  const actionFn = vi.fn(() => history.push("local"));
  const parentAction1Fn = vi.fn(() => history.push("parent1"));
  const parentAction2Fn = vi.fn(() => history.push("parent2"));

  const controller = renderHook(() => useActionController(), {
    wrapper: (props) => (
      <Action action={parentAction2Fn}>
        <Action break>
          <Action action={parentAction1Fn}>
            <Action showFeedback action={actionFn}>
              {props.children}
            </Action>
          </Action>
        </Action>
      </Action>
    ),
  }).result.current;

  controller.execute();
  expect(history.join()).toBe("local,parent1");
});
