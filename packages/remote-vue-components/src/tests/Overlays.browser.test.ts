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

/*
 * A modal that protects unsaved changes, with a close in its body and one in
 * its footer — the two the confirmation treats differently.
 */
const unsavedSquadronModal = () =>
  h(Modal, { confirmOnClose: true }, () => [
    h(Heading, null, () => "Unsaved squadron"),
    h(Content, null, () => [
      h(Text, null, () => "Rally your pilots."),
      h(Action, { closeModal: true }, () => h(Button, null, () => "Discard")),
    ]),
    h(ActionGroup, null, () =>
      h(Action, { closeModal: true }, () =>
        h(Button, { color: "success" }, () => "Create"),
      ),
    ),
  ]);

const openUnsavedSquadron = async () => {
  renderRemote(
    defineComponent(
      () => () =>
        h(ModalTrigger, null, () => [
          h(Button, null, () => "Open"),
          unsavedSquadronModal(),
        ]),
    ),
  );

  await page.getByRole("button", { name: "Open" }).click();
  await expect
    .element(page.getByRole("heading", { name: "Unsaved squadron" }))
    .toBeVisible();
};

const confirmation = () =>
  page.getByRole("heading", { name: "Unsaved changes" });

/** No open dialog carries this text any more. */
const isClosed = (name: string) =>
  vi.waitFor(() =>
    expect(
      [...document.querySelectorAll("[role=dialog]")].some((dialogNode) =>
        dialogNode.textContent?.includes(name),
      ),
    ).toBe(false),
  );

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

/*
 * `confirmOnClose` is the one scenario of the React visual corpus the binding
 * used to render differently. The parity harness compares the host's DOM, which
 * only proves the parent modal stays open — these cover what the confirmation
 * itself does.
 */
describe("Modal confirmOnClose", () => {
  test("asks instead of closing", async () => {
    await openUnsavedSquadron();

    await page.getByRole("button", { name: "Discard" }).click();

    await expect.element(confirmation()).toBeVisible();
    await expect
      .element(page.getByRole("heading", { name: "Unsaved squadron" }))
      .toBeVisible();
  });

  test("keeps the modal open when the confirmation is declined", async () => {
    await openUnsavedSquadron();

    await page.getByRole("button", { name: "Discard" }).click();
    await expect.element(confirmation()).toBeVisible();

    await page.getByRole("button", { name: "Keep editing" }).click();

    await isClosed("Unsaved changes");
    await expect
      .element(page.getByRole("heading", { name: "Unsaved squadron" }))
      .toBeVisible();
  });

  test("closes both when the confirmation is accepted", async () => {
    await openUnsavedSquadron();

    await page.getByRole("button", { name: "Discard" }).click();
    await expect.element(confirmation()).toBeVisible();

    await page.getByRole("button", { name: "Close" }).click();

    await vi.waitFor(() =>
      expect(document.querySelector("[role=dialog]")).toBeNull(),
    );
  });

  /*
   * Flow's `Modal` writes `bypassConfirmation` into the props context for the
   * actions in its footer: those are the deliberate way out, and asking again
   * would make every "Save" cost two clicks.
   */
  test("lets the footer close without asking", async () => {
    await openUnsavedSquadron();

    await page.getByRole("button", { name: "Create" }).click();

    await vi.waitFor(() =>
      expect(document.querySelector("[role=dialog]")).toBeNull(),
    );
  });

  /*
   * A dismiss arrives as `openChange(false)` from the host, the same way a
   * button's close arrives from an `Action` — so it has to be confirmed too, or
   * Escape becomes the way around the protection.
   */
  test("asks when the host dismisses it", async () => {
    await openUnsavedSquadron();

    await page
      .getByRole("dialog")
      .element()
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );

    await expect.element(confirmation()).toBeVisible();
    await expect
      .element(page.getByRole("heading", { name: "Unsaved squadron" }))
      .toBeVisible();
  });
});
