import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  Modal,
  ModalTrigger,
  Popover,
  PopoverTrigger,
  useOverlayController,
} from "@/index";
import {
  cleanupRemote,
  hostOverlay,
  renderRemote,
} from "@/tests/lib/environment";
import { actionStateDurations } from "@mittwald/flow-components-base";
import { page } from "vitest/browser";
import { afterEach, describe, expect, test, vi } from "vitest";
import { defineComponent, h, type Ref } from "vue";

afterEach(() => cleanupRemote());

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const renderAction = (actionProps: Record<string, unknown>) =>
  renderRemote(
    defineComponent(
      () => () => h(Action, actionProps, () => h(Button, null, () => "Fire")),
    ),
  );

const fire = () => page.getByRole("button", { name: "Fire" }).click();

/** Records every button state class the host ever showed. */
const recordButtonStates = () => {
  const seen = new Set<string>();
  const record = () =>
    document.querySelectorAll("[class*='flow--button--is-']").forEach((node) =>
      node.classList.forEach((name) => {
        if (name.startsWith("flow--button--is-")) {
          seen.add(name.replace("flow--button--", ""));
        }
      }),
    );
  const observer = new MutationObserver(record);
  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    childList: true,
  });
  return {
    seen,
    stop: () => observer.disconnect(),
  };
};

describe("Action", () => {
  /*
   * `isSucceeded` reaches the host as a remote property, so the state the
   * extension holds is what the button shows — a check mark.
   */
  test("reports success on the button after an async action", async () => {
    const onAction = vi.fn(() => sleep(50));
    renderAction({ onAction });

    await fire();

    await vi.waitFor(() =>
      expect(hostOverlay("flow--button--is-succeeded")).not.toBeNull(),
    );
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  /*
   * Flow shows success for an async action only. A sync one stays idle — and
   * the host button mutes presses while it shows a state, so a success state
   * would also swallow the next press.
   */
  test("shows nothing after a synchronous action, and takes the next press", async () => {
    const onAction = vi.fn();
    const states = recordButtonStates();
    renderAction({ onAction });

    await fire();
    await vi.waitFor(() => expect(onAction).toHaveBeenCalledTimes(1));
    await fire();

    await vi.waitFor(() => expect(onAction).toHaveBeenCalledTimes(2));
    states.stop();
    expect([...states.seen]).toEqual([]);
  });

  test("shows success after a synchronous action with showFeedback", async () => {
    renderAction({ onAction: vi.fn(), showFeedback: true });

    await fire();

    await vi.waitFor(() =>
      expect(hostOverlay("flow--button--is-succeeded")).not.toBeNull(),
    );
  });

  test("suppresses success after an async action with showFeedback false", async () => {
    const states = recordButtonStates();
    const onAction = vi.fn(() => sleep(50));
    renderAction({ onAction, showFeedback: false });

    await fire();
    await sleep(500);

    states.stop();
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(states.seen.has("is-succeeded")).toBe(false);
  });

  /* Pending only once the action has taken longer than Flow's delay. */
  test("shows pending only after the delay", async () => {
    const states = recordButtonStates();
    renderAction({ onAction: () => sleep(actionStateDurations.pending + 500) });

    await fire();
    await sleep(actionStateDurations.pending / 2);
    expect(states.seen.has("is-pending")).toBe(false);

    await vi.waitFor(
      () => expect(hostOverlay("flow--button--is-pending")).not.toBeNull(),
      { timeout: actionStateDurations.pending * 2 },
    );
    states.stop();
  });

  test("marks the button failed when the action throws", async () => {
    renderAction({
      onAction: () => {
        throw new Error("Shields are down");
      },
    });

    await fire();

    await vi.waitFor(() =>
      expect(hostOverlay("flow--button--is-failed")).not.toBeNull(),
    );
  });

  /* A failure is shown for a while, then the button works again. */
  test("takes presses again once the failure is over", async () => {
    const onAction = vi.fn(() => {
      throw new Error("Shields are down");
    });
    renderAction({ onAction });

    await fire();
    await vi.waitFor(() =>
      expect(hostOverlay("flow--button--is-failed")).not.toBeNull(),
    );
    await vi.waitFor(
      () => expect(hostOverlay("flow--button--is-failed")).toBeNull(),
      { timeout: actionStateDurations.failed * 2 },
    );

    await fire();

    await vi.waitFor(() => expect(onAction).toHaveBeenCalledTimes(2));
  });

  /*
   * A close button is an `Action` without an action. Success there would put a
   * check mark on "Cancel" — feedback for something that never ran.
   */
  test("reports nothing when there is no action to run", async () => {
    const states = recordButtonStates();

    renderRemote(
      defineComponent(() => {
        const controller = useOverlayController({ isDefaultOpen: true });
        return () =>
          h(Action, { closeOverlay: controller }, () =>
            h(Button, null, () =>
              controller.isOpen.value ? "Cancel" : "Cancelled",
            ),
          );
      }),
    );

    await page.getByRole("button", { name: "Cancel" }).click();

    /* The label changes in the render that would carry a state, too. */
    await expect
      .element(page.getByRole("button", { name: "Cancelled" }))
      .toBeVisible();
    await sleep(100);
    states.stop();
    expect([...states.seen]).toEqual([]);
  });
});

describe("Nested actions", () => {
  test("run from the inside out", async () => {
    const calls: string[] = [];

    renderRemote(
      defineComponent(
        () => () =>
          h(Action, { onAction: () => void calls.push("outer") }, () =>
            h(Action, { onAction: () => void calls.push("inner") }, () =>
              h(Button, null, () => "Fire"),
            ),
          ),
      ),
    );

    await fire();

    await vi.waitFor(() => expect(calls).toEqual(["inner", "outer"]));
  });

  /* The outer action has no `onAction`, so it runs as the next batch. */
  test("close the modal around them once the inner action is done", async () => {
    const onAction = vi.fn(() => sleep(50));

    renderRemote(
      defineComponent(
        () => () =>
          h(ModalTrigger, { isDefaultOpen: true }, () => [
            h(Button, null, () => "Open"),
            h(Modal, null, () => [
              h(Heading, null, () => "Squadron"),
              h(Content, null, () =>
                h(Action, { closeModal: true }, () =>
                  h(Action, { onAction }, () => h(Button, null, () => "Fire")),
                ),
              ),
            ]),
          ]),
      ),
    );

    await expect.element(page.getByRole("dialog")).toBeVisible();
    await fire();

    await vi.waitFor(
      () => expect(document.querySelector("[role=dialog]")).toBeNull(),
      { timeout: 5000 },
    );
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

const openPopoverInModal = async () => {
  await expect.element(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "More" }).click();
  await expect
    .element(page.getByRole("button", { name: "Leave" }))
    .toBeVisible();
};

describe("closeModal", () => {
  /* Flow resolves it by name, so a popover in between is not the target. */
  test("closes the modal, not the popover it sits in", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(ModalTrigger, { isDefaultOpen: true }, () => [
            h(Button, null, () => "Open"),
            h(Modal, null, () => [
              h(Heading, null, () => "Squadron"),
              h(Content, null, () =>
                h(PopoverTrigger, null, () => [
                  h(Button, null, () => "More"),
                  h(Popover, null, () =>
                    h(Action, { closeModal: true }, () =>
                      h(Button, null, () => "Leave"),
                    ),
                  ),
                ]),
              ),
            ]),
          ]),
      ),
    );

    await openPopoverInModal();
    await page.getByRole("button", { name: "Leave" }).click();

    await vi.waitFor(() => expect(hostOverlay("flow--modal")).toBeNull(), {
      timeout: 5000,
    });
  });

  test("closeOverlay closes the nearest overlay, whichever it is", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(ModalTrigger, { isDefaultOpen: true }, () => [
            h(Button, null, () => "Open"),
            h(Modal, null, () => [
              h(Heading, null, () => "Squadron"),
              h(Content, null, () =>
                h(PopoverTrigger, null, () => [
                  h(Button, null, () => "More"),
                  h(Popover, null, () =>
                    h(Action, { closeOverlay: true }, () =>
                      h(Button, null, () => "Leave"),
                    ),
                  ),
                ]),
              ),
            ]),
          ]),
      ),
    );

    await openPopoverInModal();
    await page.getByRole("button", { name: "Leave" }).click();

    await vi.waitFor(() => expect(hostOverlay("flow--popover")).toBeNull(), {
      timeout: 5000,
    });
    expect(hostOverlay("flow--modal")).not.toBeNull();
  });

  /*
   * A modal tells the actions in its footer not to ask for confirmation. The
   * controller they name has to survive that — spread into an options object,
   * it is no controller any more and the action closes the modal instead.
   */
  test("a footer action closes the overlay its controller names", async () => {
    let otherIsOpen: Ref<boolean> | undefined;

    renderRemote(
      defineComponent(() => {
        const other = useOverlayController({ isDefaultOpen: true });
        otherIsOpen = other.isOpen;
        return () =>
          h(ModalTrigger, { isDefaultOpen: true }, () => [
            h(Button, null, () => "Open"),
            h(Modal, null, () => [
              h(Heading, null, () => "Squadron"),
              h(Content, null, () => "Briefing"),
              h(ActionGroup, null, () =>
                h(Action, { closeOverlay: other }, () =>
                  h(Button, null, () => "Dismiss the other"),
                ),
              ),
            ]),
          ]);
      }),
    );

    await page.getByRole("button", { name: "Dismiss the other" }).click();

    await vi.waitFor(() => expect(otherIsOpen?.value).toBe(false));
    expect(hostOverlay("flow--modal")).not.toBeNull();
  });
});
