import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { type FC } from "react";
import Action from "@/components/Action";
import { Button, type ButtonProps } from "@/components/Button";
import type { Mock } from "vitest";
import { Modal } from "@/index/flr-universal";
import Content from "@/components/Content/Content";
import ActionGroup from "@/components/ActionGroup/ActionGroup";
import Heading from "@/components/Heading/Heading";

const asyncActionDuration = 700;
const sleep = () =>
  new Promise((res) => window.setTimeout(res, asyncActionDuration));

let syncAction1: Mock;
let syncAction2: Mock;
let asyncAction1: Mock;
let asyncAction2: Mock;
let actionHistory: string[];

beforeEach(() => {
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
    <Action action={syncAction1}>
      <TestButton />
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
});

test("Action function is updated when action prop changes", async () => {
  const { rerender } = await render(
    <Action action={syncAction1}>
      <TestButton />
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).not.toHaveBeenCalledOnce();

  await rerender(
    <Action action={syncAction2}>
      <TestButton />
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).toHaveBeenCalledOnce();
});

test("Nested sync actions are called when trigger is clicked", async () => {
  await render(
    <Action action={syncAction2}>
      <Action action={syncAction1}>
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
    <Action action={syncAction2}>
      <Action break>
        <Action action={syncAction1}>
          <TestButton />
        </Action>
      </Action>
    </Action>,
  );
  await clickTrigger();
  expect(syncAction1).toHaveBeenCalledOnce();
  expect(syncAction2).not.toHaveBeenCalledOnce();
});

test("Nested sync actions are not called when skipped", async () => {
  await render(
    <Action action={syncAction2}>
      <Action action={syncAction2}>
        <Action skip>
          <Action action={syncAction1}>
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
    <Action action={syncAction2}>
      <Action action={syncAction2}>
        <Action skip={2}>
          <Action action={syncAction1}>
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
    <Action action={syncAction2}>
      <Action action={syncAction1}>
        <TestButton />
      </Action>
    </Action>,
  );

  await clickTrigger();
  expect(actionHistory).toEqual(["sync1", "sync2"]);
});

test("Button is enabled again when async action has completed", async () => {
  const ui = () => (
    <Action action={asyncAction1}>
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
    <Action action={asyncAction2}>
      <Action action={asyncAction1}>
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
    <Action action={asyncAction1} showFeedback={false}>
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

describe("Feedback", () => {
  test("is shown when sync action succeeds", async () => {
    await render(
      <Action action={syncAction1} showFeedback>
        <TestButton />
      </Action>,
    );
    await clickTrigger();
    expectIconInDom("check");
  });

  test("is shown when set in props", async () => {
    const { rerender } = await render(
      <Action action={syncAction1} showFeedback>
        <TestButton isSucceeded />
      </Action>,
    );
    expectIconInDom("check");
    await rerender(
      <Action action={syncAction1} showFeedback>
        <TestButton isFailed />
      </Action>,
    );
    expectIconInDom("x");
  });

  test("is shown when sync action fails", async () => {
    syncAction1.mockImplementation(() => {
      throw new Error("Whoops");
    });
    await render(
      <Action action={syncAction1} showFeedback>
        <TestButton />
      </Action>,
    );
    await clickTrigger();
    expectIconInDom("x");
  });

  test("is hidden after some time", async () => {
    const ui = () => (
      <Action action={syncAction1} showFeedback>
        <TestButton />
      </Action>
    );
    const { rerender } = await render(ui());
    await clickTrigger();
    await vitest.advanceTimersByTimeAsync(2000);
    await rerender(ui());
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
    const ui = () => (
      <Action action={asyncAction1}>
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
      <Action action={asyncAction1}>
        <TestButton isPending />
      </Action>,
    );
    expectIconInDom("loader-2");
  });

  test("is not shown when sync action is executed", async () => {
    const ui = () => (
      <Action action={syncAction1}>
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
      <Action action={asyncAction1} showFeedback>
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
