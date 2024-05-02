import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import Action from "@/components/Action";
import { Button } from "@/components/Button";
import type { Mock } from "vitest";
import { beforeEach, vitest } from "vitest";
import userEvent from "@/lib/dev/vitestUserEvent";
import { act } from "react-dom/test-utils";

const asyncActionDuration = 700;
const sleep = () =>
  new Promise((res) => window.setTimeout(res, asyncActionDuration));

let syncAction1: Mock;
let syncAction2: Mock;
let asyncAction1: Mock;
let asyncAction2: Mock;

beforeEach(() => {
  vitest.useFakeTimers();
  vitest.resetAllMocks();
  syncAction1 = vitest.fn();
  syncAction2 = vitest.fn();
  asyncAction1 = vitest.fn(async () => {
    await sleep();
  });
  asyncAction2 = vitest.fn(async () => {
    await sleep();
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

test("Sync Action is called when trigger is clicked", async () => {
  render(<Action action={syncAction1}>{button}</Action>);
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
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

test("When nested sync actions, the inner action is called first", async () => {
  syncAction1.mockImplementation(() => {
    expect(syncAction2).not.toHaveBeenCalled();
  });

  render(
    <Action action={syncAction2}>
      <Action action={syncAction1}>{button}</Action>
    </Action>,
  );

  await clickTrigger();
});

test("Button is enabled again when async action has completed", async () => {
  render(<Action action={asyncAction1}>{button}</Action>);
  await clickTrigger();
  await act(() => vitest.advanceTimersByTimeAsync(asyncActionDuration));
  expect(getButton()).not.toBeDisabled();
});

test("When nested async actions, the outer action is called after the first has completed", async () => {
  render(
    <Action action={asyncAction2}>
      <Action action={asyncAction1}>{button}</Action>
    </Action>,
  );
  await clickTrigger();

  await act(() => vitest.advanceTimersByTimeAsync(asyncActionDuration - 1));
  expect(asyncAction1).toHaveBeenCalled();
  expect(asyncAction2).not.toHaveBeenCalled();

  await act(() => vitest.advanceTimersByTimeAsync(1));
  expect(asyncAction2).toHaveBeenCalled();
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
    await act(() => vitest.advanceTimersByTimeAsync(2000));
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
    await act(() => vitest.advanceTimersByTimeAsync(1000));
    expectIconInDom("loader-2");
  });

  test("is not shown when sync action is executed", async () => {
    render(<Action action={syncAction1}>{button}</Action>);
    await clickTrigger();
    await act(() => vitest.advanceTimersByTimeAsync(1000));
    expectNoIconInDom();
  });

  test("is hidden after some time", async () => {
    render(
      <Action action={asyncAction1} showFeedback>
        {button}
      </Action>,
    );
    await clickTrigger();
    await act(() => vitest.advanceTimersByTimeAsync(3000));
    expectNoIconInDom();
  });
});
