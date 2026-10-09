import { NotificationController } from "@/components/NotificationProvider";
import { afterEach, describe, expect, test, vi } from "vitest";
import { h } from "vue";

const Notification = { name: "Notification", render: () => null };

afterEach(() => {
  vi.useRealTimers();
});

describe("NotificationController", () => {
  test("keeps what was added, in order", () => {
    const controller = new NotificationController();

    const first = controller.add(h(Notification, { id: "first" }));
    const second = controller.add(h(Notification, { id: "second" }));

    expect(first).not.toBe(second);
    expect(
      controller.notifications.map((entry) => entry.element.props?.id),
    ).toEqual(["first", "second"]);
  });

  test("removes by id", () => {
    const controller = new NotificationController();
    const id = controller.add(h(Notification));
    controller.add(h(Notification));

    controller.remove(id);

    expect(controller.notifications).toHaveLength(1);
  });

  test("ignores an id it does not know", () => {
    const controller = new NotificationController();
    controller.add(h(Notification));

    controller.remove(999);

    expect(controller.notifications).toHaveLength(1);
  });

  test("closes an autoClose notification on its own", () => {
    vi.useFakeTimers();
    const controller = new NotificationController();
    controller.add(h(Notification, { autoClose: true }));

    vi.advanceTimersByTime(10_000);

    expect(controller.notifications).toHaveLength(0);
  });

  test("keeps a notification without autoClose", () => {
    vi.useFakeTimers();
    const controller = new NotificationController();
    controller.add(h(Notification));

    vi.advanceTimersByTime(60_000);

    expect(controller.notifications).toHaveLength(1);
  });

  /*
   * The pause is what makes an auto-closing notification readable: a pointer
   * resting on it, or the focus landing in it, must not let it disappear
   * mid-sentence — and the time already spent must not be lost either.
   */
  test("pauses and resumes the auto-close with the time left", () => {
    vi.useFakeTimers();
    const controller = new NotificationController();
    controller.add(h(Notification, { autoClose: true }));
    const [entry] = controller.notifications;
    if (!entry) {
      throw new Error("The notification was not added.");
    }

    vi.advanceTimersByTime(6000);
    controller.pauseAutoClose(entry);
    vi.advanceTimersByTime(60_000);

    expect(controller.notifications).toHaveLength(1);

    controller.resumeAutoClose(entry);
    vi.advanceTimersByTime(3999);
    expect(controller.notifications).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(controller.notifications).toHaveLength(0);
  });
});
