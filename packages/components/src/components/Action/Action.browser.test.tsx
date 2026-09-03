import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { type FC } from "react";
import Action, { abortAction, type ActionProps } from "@/components/Action";
import { ActionBatch } from "@/components/Action";
import { Button, type ButtonProps } from "@/components/Button";
import type { Mock } from "vitest";
import Content from "@/components/Content/Content";
import ActionGroup from "@/components/ActionGroup/ActionGroup";
import Heading from "@/components/Heading/Heading";
import Modal from "@/components/Modal";
import { duration } from "@/components/Action/models/ActionState";

const asyncActionDuration = 700;
const sleep = () =>
  new Promise((res) => window.setTimeout(res, asyncActionDuration));

let syncAction1: Mock;
let syncAction2: Mock;
let asyncAction1: Mock;
let asyncAction2: Mock;
let actionHistory: string[];

const unhandledRejectionHandler = vitest.fn();
const unhandledErrorHandler = vitest.fn();

beforeEach(() => {
  window.addEventListener("unhandledrejection", unhandledRejectionHandler);
  window.addEventListener("error", unhandledErrorHandler);

  vitest.useFakeTimers();
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
  window.removeEventListener("unhandledrejection", unhandledRejectionHandler);
  window.removeEventListener("error", unhandledErrorHandler);
});

const TestButton: FC<ButtonProps> = (p) => (
  <Button data-testid="button" {...p}>
    Test
  </Button>
);

const getButton = (testId = "button") => page.getByTestId(testId);

const clickTrigger = async (testId = "button") => {
  await userEvent.click(getButton(testId));
};

test("Sync Action is called when trigger is clicked", async () => {
  await render(
    <Action onAction={syncAction1}>
      <TestButton />
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
});

test("Action function is updated when action prop changes", async () => {
  const { rerender } = await render(
    <Action onAction={syncAction1}>
      <TestButton />
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).not.toHaveBeenCalledOnce();

  await rerender(
    <Action onAction={syncAction2}>
      <TestButton />
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).toHaveBeenCalledOnce();
});

test("Nested sync actions are called when trigger is clicked", async () => {
  await render(
    <Action onAction={syncAction2}>
      <Action onAction={syncAction1}>
        <TestButton />
      </Action>
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).toHaveBeenCalledOnce();
});

test("Nested sync actions are not called when break action is used", async () => {
  await render(
    <Action onAction={syncAction2}>
      <Action break>
        <Action onAction={syncAction1}>
          <TestButton />
        </Action>
      </Action>
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).not.toHaveBeenCalledOnce();
});

test("Nested sync actions are not called when action is aborted", async () => {
  syncAction1.mockImplementation(() => {
    abortAction("Aborted");
  });

  await render(
    <Action onAction={syncAction2}>
      <Action onAction={syncAction1}>
        <TestButton />
      </Action>
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).not.toHaveBeenCalledOnce();
});

test("Nested sync actions are not called when skipped", async () => {
  await render(
    <Action onAction={syncAction2}>
      <Action onAction={syncAction2}>
        <Action skip>
          <Action onAction={syncAction1}>
            <TestButton />
          </Action>
        </Action>
      </Action>
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).toHaveBeenCalledOnce();
});

test("Nested sync actions are not called when multiple skipped", async () => {
  await render(
    <Action onAction={syncAction2}>
      <Action onAction={syncAction2}>
        <Action skip={2}>
          <Action onAction={syncAction1}>
            <TestButton />
          </Action>
        </Action>
      </Action>
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).not.toHaveBeenCalledOnce();
});

test("When nested sync actions, the inner action is called first", async () => {
  await render(
    <Action onAction={syncAction2}>
      <Action onAction={syncAction1}>
        <TestButton />
      </Action>
    </Action>,
  );

  await clickTrigger();
  expect(actionHistory).toEqual(["sync1", "sync2"]);
});

test("Button is enabled again when async action has completed", async () => {
  const ui = () => (
    <Action onAction={asyncAction1}>
      <TestButton />
    </Action>
  );
  const { rerender } = await render(ui());
  await clickTrigger();
  await vitest.advanceTimersByTimeAsync(asyncActionDuration);
  await rerender(ui());
  expect(getButton()).not.toBeDisabled();
});

test("When nested async actions, the outer action is called after the first has completed", async () => {
  const ui = () => (
    <Action onAction={asyncAction2}>
      <Action onAction={asyncAction1}>
        <TestButton />
      </Action>
    </Action>
  );
  const { rerender } = await render(ui());
  await clickTrigger();
  await vitest.advanceTimersByTimeAsync(asyncActionDuration * 2);
  await rerender(ui());
  expect(actionHistory).toEqual([
    "async1/start",
    "async1/end",
    "async2/start",
    "async2/end",
  ]);
});

const expectIconInDom = (iconName: string) => {
  expect(
    page.getByRole("img", {
      includeHidden: true,
    }),
  ).toHaveClass(`tabler-icon-${iconName}`);
};

const expectNoIconInDom = () => {
  expect(
    page.getByRole("img", {
      includeHidden: true,
    }),
  ).not.toBeInTheDocument();
};

describe("Confirmation modal", () => {
  const testModal = () => (
    <Action onAction={asyncAction1} showFeedback={false}>
      <Modal slot="actionConfirm">
        <Heading>Heading</Heading>
        <Content data-testid="modal">Modal content</Content>
        <ActionGroup>
          <Button color="danger" data-testid="confirm-button">
            Confirm
          </Button>
          <Button color="secondary" variant="soft" data-testid="abort-button">
            Abort
          </Button>
        </ActionGroup>
      </Modal>
      <TestButton />
    </Action>
  );

  const ui = () => ({
    modal: page.getByTestId("modal"),
    confirmButton: page.getByTestId("confirm-button"),
    abortButton: page.getByTestId("abort-button"),
    actionButton: page.getByTestId("button"),
  });

  test("just closes on abort", async () => {
    const { rerender } = await render(testModal());
    const { abortButton, actionButton, modal } = ui();

    await userEvent.click(actionButton);
    expect(modal).toBeInTheDocument();
    expect(actionHistory).toEqual([]);

    await userEvent.click(abortButton);
    await vitest.advanceTimersByTimeAsync(asyncActionDuration * 2);
    await rerender(testModal());

    expect(actionHistory).toEqual([]);
    expect(modal).not.toBeInTheDocument();
  });

  test("calls action and then closes", async () => {
    const { rerender } = await render(testModal());
    const { confirmButton, actionButton, modal } = ui();

    await userEvent.click(actionButton);
    expect(modal).toBeInTheDocument();
    expect(actionHistory).toEqual([]);

    await userEvent.click(confirmButton);
    await vitest.advanceTimersByTimeAsync(asyncActionDuration * 2);
    await rerender(testModal());

    expect(modal).not.toBeInTheDocument();
    expect(actionHistory).toEqual(["async1/start", "async1/end"]);
  });
});

describe("Global error handler", () => {
  test("is called when sync action fails", async () => {
    syncAction1.mockImplementation(() => {
      throw new Error("Whoops");
    });

    const ui = () => (
      <Action onAction={syncAction1}>
        <TestButton />
      </Action>
    );

    await render(ui());
    await clickTrigger();

    expect(unhandledErrorHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ message: "Whoops" }),
      }),
    );
  });

  test("is called when async action fails", async () => {
    asyncAction1.mockImplementation(async () => {
      await sleep();
      throw new Error("Whoops");
    });

    const ui = () => (
      <Action onAction={asyncAction1}>
        <TestButton />
      </Action>
    );

    const { rerender } = await render(ui());
    await clickTrigger();
    await vitest.advanceTimersByTimeAsync(asyncActionDuration * 2);
    await rerender(ui());

    expect(unhandledRejectionHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: expect.objectContaining({ message: "Whoops" }),
      }),
    );
  });

  test("is not called when AbortActionError is thrown", async () => {
    syncAction1.mockImplementation(() => {
      abortAction("Aborted error");
    });

    const ui = () => (
      <Action onAction={syncAction1}>
        <TestButton />
      </Action>
    );

    await render(ui());
    await clickTrigger();

    expect(unhandledErrorHandler).not.toHaveBeenCalled();
  });
});

describe("Feedback", () => {
  const runTest = async (options: { props?: Partial<ActionProps> } = {}) => {
    const ui = () => (
      <Action
        {...options.props}
        onAction={
          options.props?.onAction ??
          (() => {
            // empty sync action
          })
        }
      >
        <TestButton />
      </Action>
    );

    const { rerender } = await render(ui());
    await clickTrigger();
    return {
      advanceTime: (time = asyncActionDuration) =>
        vitest.advanceTimersByTimeAsync(time),
      rerender: () => rerender(ui()),
    };
  };

  test("is shown when sync action succeeds", async () => {
    await runTest({ props: { showFeedback: true } });
    expectIconInDom("check");
  });

  test("is shown when async action succeeds", async () => {
    const { rerender, advanceTime } = await runTest({
      props: { onAction: sleep, showFeedback: true },
    });
    await advanceTime();
    await rerender();
    expectIconInDom("check");
  });

  test("is shown when sync action fails", async () => {
    await runTest({
      props: {
        onAction: () => {
          throw new Error("Whoops");
        },
      },
    });
    expectIconInDom("x");
  });

  test("is shown when sync action fails with AbortActionError", async () => {
    await runTest({
      props: {
        onAction: () => {
          abortAction("Aborted error");
        },
      },
    });
    expectIconInDom("x");
  });

  test("is shown when async action fails", async () => {
    const { rerender, advanceTime } = await runTest({
      props: {
        onAction: async () => {
          await sleep();
          throw new Error("Whoops");
        },
      },
    });
    await advanceTime();
    await rerender();
    expectIconInDom("x");
  });

  test("is shown when set in props", async () => {
    const { rerender } = await render(
      <Action onAction={syncAction1} showFeedback>
        <TestButton isSucceeded />
      </Action>,
    );
    expectIconInDom("check");
    await rerender(
      <Action onAction={syncAction1} showFeedback>
        <TestButton isFailed />
      </Action>,
    );
    expectIconInDom("x");
  });

  test("is hidden after some time", async () => {
    const { rerender, advanceTime } = await runTest({
      props: { showFeedback: true },
    });
    await advanceTime(2000);
    await rerender();
    expectNoIconInDom();
  });

  test("can be splitted by batches", async () => {
    asyncAction1.mockImplementation(async () => {
      await sleep();
      await sleep();
    });

    asyncAction2.mockImplementation(async () => {
      await sleep();
      await sleep();
    });

    const ui = () => (
      <Action onAction={asyncAction2}>
        <ActionBatch>
          <Action onAction={asyncAction1}>
            <TestButton />
          </Action>
        </ActionBatch>
      </Action>
    );

    const { rerender } = await render(ui());
    expectNoIconInDom();

    await clickTrigger();

    // First batch
    await vitest.advanceTimersByTimeAsync(duration.pending);
    await rerender(ui());
    expectIconInDom("loader-2");

    // First batch done
    await vitest.advanceTimersByTimeAsync(
      asyncActionDuration * 2 - duration.pending,
    );
    await rerender(ui());
    expectIconInDom("check");

    // Second batch
    await vitest.advanceTimersByTimeAsync(
      duration.succeeded + duration.pending,
    );
    await rerender(ui());
    expectIconInDom("loader-2");

    // Second batch done
    await vitest.advanceTimersByTimeAsync(
      asyncActionDuration * 2 - duration.pending,
    );
    await rerender(ui());
    expectIconInDom("check");
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
    const ui = () => (
      <Action onAction={asyncAction1}>
        <TestButton />
      </Action>
    );
    const { rerender } = await render(ui());
    await clickTrigger();
    await vitest.advanceTimersByTimeAsync(1000);
    await rerender(ui());
    expectIconInDom("loader-2");
  });

  test("is shown when set in props", async () => {
    await render(
      <Action onAction={asyncAction1}>
        <TestButton isPending />
      </Action>,
    );
    expectIconInDom("loader-2");
  });

  test("is not shown when sync action is executed", async () => {
    const ui = () => (
      <Action onAction={syncAction1}>
        <TestButton />
      </Action>
    );
    const { rerender } = await render(ui());
    await clickTrigger();
    await vitest.advanceTimersByTimeAsync(1000);
    await rerender(ui());
    expectNoIconInDom();
  });

  test("is hidden after some time", async () => {
    const ui = () => (
      <Action onAction={asyncAction1} showFeedback>
        <TestButton />
      </Action>
    );

    const { rerender } = await render(ui());
    await clickTrigger();
    await vitest.advanceTimersByTimeAsync(3000);
    await rerender(ui());
    expectNoIconInDom();
  });
});
