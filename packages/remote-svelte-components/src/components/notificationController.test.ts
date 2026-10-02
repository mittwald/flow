import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { Snippet } from "svelte";
import { NotificationController } from "./notificationController.svelte.js";

/*
 * The controller is the half of `NotificationProvider` with rules: an id per
 * notification, and an auto-close timer that has to pause while someone is
 * reading and resume with the time it had left. Flow's version is a MobX model;
 * this one is a rune, and the contract an extension sees is the same.
 */
const notification = (() => undefined) as unknown as Snippet;

const firstEntry = (controller: NotificationController) => {
  const [entry] = controller.notifications;
  if (!entry) {
    throw new Error("The controller holds no notification");
  }
  return entry;
};

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("NotificationController", () => {
  test("hands out an id per notification and removes by it", () => {
    const controller = new NotificationController();

    const first = controller.add(notification);
    const second = controller.add(notification);

    expect([first, second]).toEqual([0, 1]);
    expect(controller.notifications).toHaveLength(2);

    controller.remove(first);

    expect(controller.notifications.map((entry) => entry.id)).toEqual([second]);
  });

  test("ignores an id it does not know", () => {
    const controller = new NotificationController();
    controller.add(notification);

    controller.remove(99);

    expect(controller.notifications).toHaveLength(1);
  });

  test("keeps a notification until it is removed", () => {
    const controller = new NotificationController();
    controller.add(notification);

    vi.advanceTimersByTime(60_000);

    expect(controller.notifications).toHaveLength(1);
  });

  test("closes an autoClose notification after ten seconds", () => {
    const controller = new NotificationController();
    controller.add(notification, { autoClose: true });

    vi.advanceTimersByTime(9_999);
    expect(controller.notifications).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(controller.notifications).toHaveLength(0);
  });

  /*
   * The pause is what the hover and focus handlers are for. Resuming has to use
   * the time that was left, not a fresh ten seconds — otherwise a pointer
   * passing over a notification keeps it alive indefinitely.
   */
  test("pauses the timer and resumes it with the time that was left", () => {
    const controller = new NotificationController();
    controller.add(notification, { autoClose: true });
    const entry = firstEntry(controller);

    vi.advanceTimersByTime(6_000);
    controller.pauseAutoClose(entry);

    vi.advanceTimersByTime(60_000);
    expect(controller.notifications).toHaveLength(1);

    controller.resumeAutoClose(entry);

    vi.advanceTimersByTime(3_999);
    expect(controller.notifications).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(controller.notifications).toHaveLength(0);
  });

  test("does not start a timer for a notification that has none", () => {
    const controller = new NotificationController();
    const id = controller.add(notification);

    controller.resumeAutoClose(firstEntry(controller));
    vi.advanceTimersByTime(60_000);

    expect(controller.notifications.map((e) => e.id)).toEqual([id]);
  });
});
