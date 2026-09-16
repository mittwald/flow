import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  LightBox,
  LightBoxTrigger,
  Modal,
  ModalTrigger,
  Popover,
  PopoverTrigger,
  Text,
  useOverlayController,
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

const squadronModal = () =>
  h(Modal, null, () => [
    h(Heading, null, () => "New squadron"),
    h(Content, null, () => h(Text, null, () => "Rally your pilots.")),
    h(ActionGroup, null, () =>
      h(Action, { closeModal: true }, () =>
        h(Button, { color: "success" }, () => "Create"),
      ),
    ),
  ]);

const dialog = () => page.getByRole("dialog");

describe("Modal", () => {
  test("opens from its trigger and renders the host's modal", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(ModalTrigger, null, () => [
            h(Button, null, () => "New squadron"),
            squadronModal(),
          ]),
      ),
    );

    await page.getByRole("button", { name: "New squadron" }).click();

    await expect
      .element(page.getByRole("heading", { name: "New squadron" }))
      .toBeVisible();
    await expect.element(dialog()).toBeVisible();
  });

  /*
   * The classes are what make the host render a modal rather than a bare
   * dialog — `Modal` is a React composition on the host side, and this is the
   * Vue rebuild's only way to ask for it. A rename there breaks this test
   * before it breaks a user's modal.
   */
  test("asks the host for the modal it was configured as", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(ModalTrigger, null, () => [
            h(Button, null, () => "Open"),
            h(Modal, { offCanvas: true, size: "l" }, () =>
              h(Heading, null, () => "Off canvas"),
            ),
          ]),
      ),
    );

    await page.getByRole("button", { name: "Open" }).click();
    await expect.element(dialog()).toBeVisible();

    expect(hostOverlay("flow--modal--off-canvas")).not.toBeNull();
    expect(hostOverlay("flow--modal--size-l")).not.toBeNull();
  });

  test("closes again through an Action", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(ModalTrigger, null, () => [
            h(Button, null, () => "New squadron"),
            squadronModal(),
          ]),
      ),
    );

    await page.getByRole("button", { name: "New squadron" }).click();
    await expect.element(dialog()).toBeVisible();

    await page.getByRole("button", { name: "Create" }).click();

    await vi.waitFor(() =>
      expect(document.querySelector("[role=dialog]")).toBeNull(),
    );
  });

  test("opens from a controller the app holds", async () => {
    renderRemote(
      defineComponent(() => {
        const controller = useOverlayController();
        return () => [
          h(Button, { onPress: controller.open }, () => "Open"),
          h(Modal, { controller }, () => h(Heading, null, () => "Controlled")),
        ];
      }),
    );

    await page.getByRole("button", { name: "Open" }).click();

    await expect
      .element(page.getByRole("heading", { name: "Controlled" }))
      .toBeVisible();
  });

  /*
   * Dismissing happens on the host: react-aria closes the dialog and reports it
   * back through `openChange`. Without that report the Vue side still thinks it
   * is open and the trigger stops working.
   */
  test("takes the state back when the host dismisses it", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(ModalTrigger, null, () => [
            h(Button, null, () => "Open"),
            squadronModal(),
          ]),
      ),
    );

    const trigger = page.getByRole("button", { name: "Open" });
    await trigger.click();
    await expect.element(dialog()).toBeVisible();

    await page
      .getByRole("dialog")
      .element()
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );

    await vi.waitFor(() =>
      expect(document.querySelector("[role=dialog]")).toBeNull(),
    );

    await trigger.click();
    await expect.element(dialog()).toBeVisible();
  });
});

describe("Popover", () => {
  test("opens from its trigger", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(PopoverTrigger, null, () => [
            h(Button, null, () => "Details"),
            h(Popover, null, () =>
              h(Content, null, () => h(Text, null, () => "Squadron details")),
            ),
          ]),
      ),
    );

    await page.getByRole("button", { name: "Details" }).click();

    await vi.waitFor(() =>
      expect(hostOverlay("flow--popover")?.textContent).toContain(
        "Squadron details",
      ),
    );
  });
});

describe("LightBox", () => {
  test("opens from its trigger", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(LightBoxTrigger, null, () => [
            h(Button, null, () => "Show"),
            h(LightBox, null, () =>
              h(Content, null, () => h(Text, null, () => "Death Star plans")),
            ),
          ]),
      ),
    );

    await page.getByRole("button", { name: "Show" }).click();

    await vi.waitFor(() =>
      expect(hostOverlay("flow--light-box")?.textContent).toContain(
        "Death Star plans",
      ),
    );
  });
});
