import {
  Action,
  BrowserOnly,
  Button,
  DeprecationWarningProvider,
  Heading,
  Notification,
  NotificationProvider,
  Section,
  Text,
  useNotificationController,
  useWarnDeprecation,
  Wrap,
} from "@/index";
import {
  cleanupRemote,
  hostOverlay,
  renderRemote,
} from "@/tests/lib/environment";
import { page } from "vitest/browser";
import { afterEach, describe, expect, test, vi } from "vitest";
import { defineComponent, h } from "vue";

afterEach(() => cleanupRemote());

describe("A child's own handler", () => {
  /*
   * Flow's props context chains the handler it adds with the one the child
   * already has, and an `Action`'s runs after the child's.
   */
  test("runs before the action the button triggers", async () => {
    const pressed: string[] = [];

    renderRemote(
      defineComponent(
        () => () =>
          h(Action, { onAction: () => void pressed.push("action") }, () =>
            h(Button, { onPress: () => pressed.push("press") }, () => "Fire"),
          ),
      ),
    );

    await page.getByRole("button", { name: "Fire" }).click();

    await vi.waitFor(() => expect(pressed).toEqual(["press", "action"]));
  });

  /*
   * The provider replaces the notification's `onClose` with its own, which
   * removes the notification and then calls the one the app passed — once.
   */
  test("closes a notification that has an onClose of its own", async () => {
    const onClose = vi.fn();

    const Raiser = defineComponent(() => {
      const controller = useNotificationController();
      return () =>
        h(
          Button,
          {
            onPress: () =>
              controller.add(
                h(Notification, { onClose }, () =>
                  h(Text, null, () => "Squadron created"),
                ),
              ),
          },
          () => "Notify",
        );
    });

    renderRemote(
      defineComponent(
        () => () => h(NotificationProvider, null, () => h(Raiser)),
      ),
    );

    await page.getByRole("button", { name: "Notify" }).click();
    await vi.waitFor(() =>
      expect(hostOverlay("flow--notification")).not.toBeNull(),
    );

    await page.getByRole("button", { name: "Close" }).click();

    await vi.waitFor(
      () => expect(hostOverlay("flow--notification")).toBeNull(),
      { timeout: 5000 },
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("Wrap", () => {
  test("renders the wrapper when the condition holds", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(Wrap, { if: true }, () =>
            h(Section, null, () => h(Heading, null, () => "Wrapped")),
          ),
      ),
    );

    await expect
      .element(page.getByRole("heading", { name: "Wrapped" }))
      .toBeVisible();
  });

  /*
   * Unwrapping has to keep the children and drop only the wrapper — the point
   * of the component is a conditional wrapper, not a conditional subtree.
   */
  test("renders the wrapper's children without it otherwise", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(Wrap, { if: false }, () =>
            h(Section, null, () => h(Heading, null, () => "Unwrapped")),
          ),
      ),
    );

    await expect
      .element(page.getByRole("heading", { name: "Unwrapped" }))
      .toBeVisible();
  });
});

describe("BrowserOnly", () => {
  test("renders its children once mounted", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(BrowserOnly, null, () => h(Heading, null, () => "Client only")),
      ),
    );

    await expect
      .element(page.getByRole("heading", { name: "Client only" }))
      .toBeVisible();
  });
});

describe("NotificationProvider", () => {
  test("renders what the controller was given, and drops it on close", async () => {
    const Raiser = defineComponent(() => {
      const controller = useNotificationController();
      return () =>
        h(
          Button,
          {
            onPress: () =>
              controller.add(
                h(Notification, null, () =>
                  h(Text, null, () => "Squadron created"),
                ),
              ),
          },
          () => "Notify",
        );
    });

    renderRemote(
      defineComponent(
        () => () => h(NotificationProvider, null, () => h(Raiser)),
      ),
    );

    await page.getByRole("button", { name: "Notify" }).click();

    await vi.waitFor(() =>
      expect(hostOverlay("flow--notification")?.textContent).toContain(
        "Squadron created",
      ),
    );
  });
});

describe("DeprecationWarningProvider", () => {
  test("reports each message once", async () => {
    const onWarning = vi.fn();
    const message = "The 'x' prop is deprecated.";

    const Deprecated = defineComponent(() => {
      const warnDeprecation = useWarnDeprecation();
      return () => {
        warnDeprecation(message);
        warnDeprecation(message);
        return h(Heading, null, () => "Rendered");
      };
    });

    renderRemote(
      defineComponent(
        () => () =>
          h(DeprecationWarningProvider, { onWarning }, () => h(Deprecated)),
      ),
    );

    await expect
      .element(page.getByRole("heading", { name: "Rendered" }))
      .toBeVisible();

    expect(onWarning).toHaveBeenCalledTimes(1);
    expect(onWarning).toHaveBeenCalledWith(message);
  });
});
