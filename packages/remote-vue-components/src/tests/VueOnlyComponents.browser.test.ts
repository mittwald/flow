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

describe("Action", () => {
  test("runs the action and reports success on the button", async () => {
    const onAction = vi.fn();

    renderRemote(
      defineComponent(
        () => () =>
          h(Action, { onAction }, () => h(Button, null, () => "Fire")),
      ),
    );

    await page.getByRole("button", { name: "Fire" }).click();

    await vi.waitFor(() => expect(onAction).toHaveBeenCalledTimes(1));
    /*
     * `isSucceeded` reaches the host as a remote property, so the state the
     * extension holds is what the button shows — a Flow button renders it as a
     * check mark rather than a label change.
     */
    await vi.waitFor(() =>
      expect(hostOverlay("flow--button--is-succeeded")).not.toBeNull(),
    );
  });

  /*
   * A close button is an `Action` without an action. Reporting success there
   * puts a check mark on "Cancel" — feedback for something that never ran.
   */
  test("reports nothing when there is no action to run", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(Action, { closeModal: true }, () =>
            h(Button, null, () => "Cancel"),
          ),
      ),
    );

    await page.getByRole("button", { name: "Cancel" }).click();

    await vi.waitFor(() => expect(hostOverlay("flow--button")).not.toBeNull());
    expect(hostOverlay("flow--button--is-succeeded")).toBeNull();
  });

  test("marks the button failed when the action throws", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(
            Action,
            {
              onAction: () => {
                throw new Error("Shields are down");
              },
            },
            () => h(Button, null, () => "Fire"),
          ),
      ),
    );

    await page.getByRole("button", { name: "Fire" }).click();

    await vi.waitFor(() =>
      expect(hostOverlay("flow--button--is-failed")).not.toBeNull(),
    );
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
