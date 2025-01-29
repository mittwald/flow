import { render, screen } from "@testing-library/react";
import React, { act } from "react";
import Action from "@/components/Action";
import { Button } from "@/components/Button";
import type { Mock } from "vitest";
import userEvent from "@/lib/dev/vitestUserEvent";

const asyncActionDuration = 700;
const sleep = () =>
  new Promise((res) => window.setTimeout(res, asyncActionDuration));

let syncAction1: Mock;
let syncAction2: Mock;
let asyncAction1: Mock;
let asyncAction2: Mock;
let actionHistory: string[];

beforeEach(() => {
  vitest.useFakeTimers({
    shouldAdvanceTime: true,
  });
  vitest.resetAllMocks();
  actionHistory = [];
  syncAction1 = vitest.fn(() => {
    actionHistory.push("sync1");
  });
  syncAction2 = vitest.fn(() => {
    actionHistory.push("sync2");
  });
  asyncAction1 = vitest.fn(async () => {
    actionHistory.push("async1/start");
    await sleep();
    actionHistory.push("async1/end");
  });
  asyncAction2 = vitest.fn(async () => {
    actionHistory.push("async2/start");
    await sleep();
    actionHistory.push("async2/end");
  });
});

afterEach(() => {
  vitest.runOnlyPendingTimers();
  vitest.useRealTimers();
});

const button = <Button data-testid="button" />;
const getButton = () => screen.getByTestId("button");

const clickTrigger = async () => {
  await act(() => userEvent.click(getButton()));
};

const advanceTime = async (ms: number) => {
  await act(() => vitest.advanceTimersByTimeAsync(ms));
};

test("Sync Action is called when trigger is clicked", async () => {
  render(<Action action={syncAction1}>{button}</Action>);
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
});

test("Action function is updated when action prop changes", async () => {
  const r = render(<Action action={syncAction1}>{button}</Action>);
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).not.toHaveBeenCalledOnce();

  r.rerender(<Action action={syncAction2}>{button}</Action>);
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).toHaveBeenCalledOnce();
});

test("Nested sync actions are called when trigger is clicked", async () => {
  render(
    <Action action={syncAction2}>
      <Action action={syncAction1}>{button}</Action>
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).toHaveBeenCalledOnce();
});

test("Nested sync actions are not called when break action is used", async () => {
  render(
    <Action action={syncAction2}>
      <Action break>
        <Action action={syncAction1}>{button}</Action>
      </Action>
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).not.toHaveBeenCalledOnce();
});

test("Nested sync actions are not called when skipped", async () => {
  render(
    <Action action={syncAction2}>
      <Action action={syncAction2}>
        <Action skip>
          <Action action={syncAction1}>{button}</Action>
        </Action>
      </Action>
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).toHaveBeenCalledOnce();
});

test("Nested sync actions are not called when multiple skipped", async () => {
  render(
    <Action action={syncAction2}>
      <Action action={syncAction2}>
        <Action skip={2}>
          <Action action={syncAction1}>{button}</Action>
        </Action>
      </Action>
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).not.toHaveBeenCalledOnce();
});

test("When nested sync actions, the inner action is called first", async () => {
  render(
    <Action action={syncAction2}>
      <Action action={syncAction1}>{button}</Action>
    </Action>,
  );

  await clickTrigger();
  expect(actionHistory).toEqual(["sync1", "sync2"]);
});

test("Button is enabled again when async action has completed", async () => {
  render(<Action action={asyncAction1}>{button}</Action>);
  await clickTrigger();
  await advanceTime(asyncActionDuration);
  expect(getButton()).not.toBeDisabled();
});

test("When nested async actions, the outer action is called after the first has completed", async () => {
  render(
    <Action action={asyncAction2}>
      <Action action={asyncAction1}>{button}</Action>
    </Action>,
  );
  await clickTrigger();
  await advanceTime(asyncActionDuration * 2);
  expect(actionHistory).toEqual([
    "async1/start",
    "async1/end",
    "async2/start",
    "async2/end",
  ]);
});

const expectIconInDom = (iconName: string) => {
  expect(
    screen.getByRole("img", {
      hidden: true,
    }).className,
  ).includes(`icon-${iconName}`);
};

const expectNoIconInDom = () => {
  expect(
    screen.queryByRole("img", {
      hidden: true,
    }),
  ).toBeNull();
};

describe("Feedback", () => {
  test("is shown when sync action succeeds", async () => {
    render(
      <Action action={syncAction1} showFeedback>
        {button}
      </Action>,
    );
    await clickTrigger();
    expectIconInDom("check");
  });

  test("is shown when sync action fails", async () => {
    syncAction1.mockImplementation(() => {
      throw new Error("Whoops");
    });
    render(
      <Action action={syncAction1} showFeedback>
        {button}
      </Action>,
    );
    await clickTrigger();
    expectIconInDom("x");
  });

  test("is hidden after some time", async () => {
    render(
      <Action action={syncAction1} showFeedback>
        {button}
      </Action>,
    );
    await clickTrigger();
    await advanceTime(2000);
    expectNoIconInDom();
  });
});

describe("Pending state", () => {
  beforeEach(() => {
    asyncAction1.mockImplementation(async () => {
      await sleep();
      await sleep();
    });
  });

  test("is shown when async action is pending", async () => {
    render(<Action action={asyncAction1}>{button}</Action>);
    await clickTrigger();
    await advanceTime(1000);
    expectIconInDom("loader-2");
  });

  test("is not shown when sync action is executed", async () => {
    render(<Action action={syncAction1}>{button}</Action>);
    await clickTrigger();
    await advanceTime(1000);
    expectNoIconInDom();
  });

  test("is hidden after some time", async () => {
    render(
      <Action action={asyncAction1} showFeedback>
        {button}
      </Action>,
    );
    await clickTrigger();
    await advanceTime(3000);
    expectNoIconInDom();
  });
});
