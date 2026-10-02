import {
  AccentBox,
  Action,
  ActionGroup,
  Button,
  ColumnLayout,
  Content,
  Header,
  Heading,
  LightBox,
  LightBoxTrigger,
  Modal,
  ModalTrigger,
  Popover,
  PopoverTrigger,
  Section,
  Text,
  useModalController,
  useOverlayController,
} from "@/index";
import {
  cleanupRemote,
  hostOverlay,
  renderRemote,
} from "@/tests/lib/environment";
import { page } from "vitest/browser";
import { afterEach, describe, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

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

  /* Flow reads the prop on every render, so a swapped controller takes over. */
  test("follows a controller the app swaps for another", async () => {
    renderRemote(
      defineComponent(() => {
        const first = useOverlayController();
        const second = useOverlayController();
        const useSecond = ref(false);
        return () => [
          h(Button, { onPress: () => (useSecond.value = true) }, () => "Swap"),
          h(Button, { onPress: second.open }, () => "Open second"),
          h(Modal, { controller: useSecond.value ? second : first }, () =>
            h(Heading, null, () => "Swapped"),
          ),
        ];
      }),
    );

    await page.getByRole("button", { name: "Swap" }).click();
    await page.getByRole("button", { name: "Open second" }).click();

    await expect
      .element(page.getByRole("heading", { name: "Swapped" }))
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

describe("Modal's props context", () => {
  const renderOpenModal = (
    children: () => unknown[],
    modalProps: Record<string, unknown> = {},
  ) =>
    renderRemote(
      defineComponent(
        () => () =>
          h(Modal, { isDefaultOpen: true, ...modalProps }, () => children()),
      ),
    );

  /*
   * Flow's `nestedHeadingProps`: the heading of a section in the content is
   * one level below the modal's own, and the section drops its separator.
   */
  test("puts a heading in a section of the content one level down", async () => {
    renderOpenModal(() => [
      h(Heading, null, () => "Squadron"),
      h(Content, null, () =>
        h(Section, null, () => [
          h(Heading, null, () => "Engines"),
          h(Text, null, () => "Both online."),
        ]),
      ),
    ]);

    await expect
      .element(page.getByRole("heading", { name: "Engines", level: 3 }))
      .toBeVisible();
    await expect
      .element(page.getByRole("heading", { name: "Squadron", level: 2 }))
      .toBeVisible();
    /* `Section` has no `level`; it used to arrive as a stray attribute. */
    expect(document.querySelector("flr-section")?.hasAttribute("level")).toBe(
      false,
    );
  });

  test("lays out a column layout and its accent box", async () => {
    renderOpenModal(() => [
      h(Heading, null, () => "Squadron"),
      h(ColumnLayout, null, () => [
        h(Section, null, () => h(Heading, null, () => "Pilots")),
        h(AccentBox, null, () => h(Text, null, () => "Summary")),
      ]),
    ]);

    await expect.element(dialog()).toBeVisible();
    expect(hostOverlay("flow--modal--column-layout")).not.toBeNull();
    expect(hostOverlay("flow--modal--accent-box")).not.toBeNull();
    await expect
      .element(page.getByRole("heading", { name: "Pilots", level: 3 }))
      .toBeVisible();
  });

  test("keeps the close button visible with showCloseButton", async () => {
    renderOpenModal(() => [h(Heading, null, () => "Squadron")], {
      showCloseButton: true,
    });

    await expect
      .element(page.getByRole("button", { name: "Close" }))
      .toHaveClass("flow--modal--always-visible");
  });
});

/*
 * Flow's overlays are UI components, which clear the props context on the host
 * too (`ClearPropsContextView`). Without that, the enclosing section header's
 * rule for `Heading` reached the modal's heading.
 */
describe("An overlay inside a section header", () => {
  test("keeps the section's rules out of the modal", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(Section, null, () =>
            h(Header, null, () => [
              h(Heading, null, () => "Squadron"),
              h(ModalTrigger, null, () => [
                h(Button, null, () => "Open"),
                h(Modal, null, () => [
                  h(Heading, null, () => "Pilots"),
                  h(Content, null, () => "Rally them."),
                ]),
              ]),
            ]),
          ),
      ),
    );

    await page.getByRole("button", { name: "Open" }).click();
    const heading = page.getByRole("heading", { name: "Pilots" });
    await expect.element(heading).toBeVisible();

    expect(heading.element().className).toContain("flow--modal--header");
    expect(heading.element().className).not.toContain("flow--section");
  });
});

describe("Modal's open state props", () => {
  test("opens itself with isDefaultOpen", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(Modal, { isDefaultOpen: true }, () =>
            h(Heading, null, () => "Squadron"),
          ),
      ),
    );

    await expect.element(dialog()).toBeVisible();
  });

  test("follows a controlled isOpen", async () => {
    const isOpen = ref(true);

    renderRemote(
      defineComponent(
        () => () =>
          h(Modal, { isOpen: isOpen.value }, () =>
            h(Heading, null, () => "Squadron"),
          ),
      ),
    );

    await expect.element(dialog()).toBeVisible();
    isOpen.value = false;
    await vi.waitFor(() =>
      expect(document.querySelector("[role=dialog]")).toBeNull(),
    );
  });

  test("reports opening and closing", async () => {
    const calls: string[] = [];

    renderRemote(
      defineComponent(
        () => () =>
          h(ModalTrigger, null, () => [
            h(Button, null, () => "Open"),
            h(
              Modal,
              {
                onOpen: () => void calls.push("open"),
                onClose: () => void calls.push("close"),
                onOpenChange: (isOpen: boolean) =>
                  void calls.push(`change:${isOpen}`),
              },
              () => [
                h(Heading, null, () => "Squadron"),
                h(ActionGroup, null, () =>
                  h(Action, { closeModal: true }, () =>
                    h(Button, null, () => "Done"),
                  ),
                ),
              ],
            ),
          ]),
      ),
    );

    await page.getByRole("button", { name: "Open" }).click();
    await expect.element(dialog()).toBeVisible();
    await page.getByRole("button", { name: "Done" }).click();
    await vi.waitFor(() =>
      expect(document.querySelector("[role=dialog]")).toBeNull(),
    );

    expect(calls).toEqual(["open", "change:true", "close", "change:false"]);
  });

  /* As in Flow, a handler returning `false` aborts the change. */
  test("stays open when onClose returns false", async () => {
    renderRemote(
      defineComponent(
        () => () =>
          h(Modal, { isDefaultOpen: true, onClose: () => false }, () => [
            h(Heading, null, () => "Squadron"),
            h(ActionGroup, null, () =>
              h(Action, { closeModal: true }, () =>
                h(Button, null, () => "Done"),
              ),
            ),
          ]),
      ),
    );

    await page.getByRole("button", { name: "Done" }).click();
    await new Promise((resolve) => setTimeout(resolve, 300));

    await expect.element(dialog()).toBeVisible();
  });
});

describe("A trigger", () => {
  /* Flow's trigger chains `open` with the button's own `onPress`. */
  test("runs the trigger button's own press handler as well", async () => {
    const onPress = vi.fn();

    renderRemote(
      defineComponent(
        () => () =>
          h(ModalTrigger, null, () => [
            h(Button, { onPress }, () => "Open"),
            squadronModal(),
          ]),
      ),
    );

    await page.getByRole("button", { name: "Open" }).click();

    await expect.element(dialog()).toBeVisible();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe("Popover", () => {
  const detailsPopover = (popoverProps: Record<string, unknown> = {}) =>
    h(PopoverTrigger, null, () => [
      h(Button, null, () => "Details"),
      h(Popover, popoverProps, () =>
        h(Content, null, () => h(Text, null, () => "Squadron details")),
      ),
    ]);

  test("opens from its trigger", async () => {
    renderRemote(defineComponent(() => () => detailsPopover()));

    await page.getByRole("button", { name: "Details" }).click();

    await vi.waitFor(() =>
      expect(hostOverlay("flow--popover")?.textContent).toContain(
        "Squadron details",
      ),
    );
  });

  /*
   * The host wraps the children in `flow--popover--content` itself; Flow has
   * no rule for a `Content` child, and a second one nested a scroll container.
   */
  test("leaves a Content child alone", async () => {
    renderRemote(defineComponent(() => () => detailsPopover()));

    await page.getByRole("button", { name: "Details" }).click();
    await vi.waitFor(() =>
      expect(hostOverlay("flow--popover")?.textContent).toContain(
        "Squadron details",
      ),
    );

    expect(document.querySelectorAll(".flow--popover--content")).toHaveLength(
      1,
    );
  });

  test("reports opening and closing through onOpenChange", async () => {
    const onOpenChange = vi.fn();
    renderRemote(defineComponent(() => () => detailsPopover({ onOpenChange })));

    await page.getByRole("button", { name: "Details" }).click();

    await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));
  });

  test("follows a controlled isOpen", async () => {
    const isOpen = ref(true);
    renderRemote(
      defineComponent(() => () => detailsPopover({ isOpen: isOpen.value })),
    );

    await vi.waitFor(() =>
      expect(hostOverlay("flow--popover")?.textContent).toContain(
        "Squadron details",
      ),
    );
    isOpen.value = false;

    await vi.waitFor(() => expect(hostOverlay("flow--popover")).toBeNull());
  });
});

describe("LightBox", () => {
  const renderLightBox = (lightBoxProps: Record<string, unknown> = {}) =>
    renderRemote(
      defineComponent(
        () => () =>
          h(LightBoxTrigger, null, () => [
            h(Button, null, () => "Show"),
            h(LightBox, lightBoxProps, () => [
              h(Text, null, () => "Death Star plans"),
              h(ActionGroup, null, () =>
                h(Action, { onAction: () => undefined }, () =>
                  h(Button, null, () => "Download"),
                ),
              ),
            ]),
          ]),
      ),
    );

  const openLightBox = async () => {
    await page.getByRole("button", { name: "Show" }).click();
    await vi.waitFor(() =>
      expect(hostOverlay("flow--light-box")?.textContent).toContain(
        "Death Star plans",
      ),
    );
    return hostOverlay("flow--light-box") as HTMLElement;
  };

  /*
   * The host tree Flow's `LightBox` builds: the children in a content
   * container, and after it an actions container with the close button and
   * the tunnelled `ActionGroup`, every button solid and `light-static`.
   */
  test("builds the host tree Flow's light box builds", async () => {
    renderLightBox();
    const lightBox = await openLightBox();

    const content = lightBox.querySelector(".flow--light-box--content");
    expect(content?.textContent).toContain("Death Star plans");
    expect(content?.textContent).not.toContain("Download");

    const actions = lightBox.querySelector(".flow--light-box--actions");
    expect(
      actions?.querySelector(".flow--light-box--action-group"),
    ).not.toBeNull();
    const buttons = [...(actions?.querySelectorAll("button") ?? [])];
    expect(
      buttons.map((button) =>
        (button.getAttribute("aria-label") ?? button.textContent)?.trim(),
      ),
    ).toEqual(["Close", "Download"]);
    for (const button of buttons) {
      expect(button.classList).toContain("flow--button--light-static");
      expect(button.classList).toContain("flow--button--solid");
    }
  });

  test("closes on its close button", async () => {
    renderLightBox();
    await openLightBox();

    await page.getByRole("button", { name: "Close" }).click();

    await vi.waitFor(() => expect(hostOverlay("flow--light-box")).toBeNull());
  });

  test("reports opening through onOpenChange", async () => {
    const onOpenChange = vi.fn();
    renderLightBox({ onOpenChange });

    await openLightBox();

    expect(onOpenChange).toHaveBeenCalledWith(true);
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

  /* As in Flow: an app that closes through the controller is asked too. */
  test("asks when the app closes it through its controller", async () => {
    renderRemote(
      defineComponent(() => {
        const controller = useOverlayController({ isDefaultOpen: true });
        return () =>
          h(Modal, { controller, confirmOnClose: true }, () => [
            h(Heading, null, () => "Unsaved squadron"),
            h(Content, null, () =>
              h(Button, { onPress: () => controller.close() }, () => "Leave"),
            ),
          ]);
      }),
    );

    await page.getByRole("button", { name: "Leave" }).click();

    await expect.element(confirmation()).toBeVisible();
  });
});

describe("useModalController", () => {
  /* Flow's `reuseControllerFromContext`, on by default. */
  test("hands back the controller of the modal it is called in", async () => {
    const LeaveButton = defineComponent(() => {
      const controller = useModalController();
      return () =>
        h(Button, { onPress: () => controller.close() }, () => "Leave");
    });

    renderRemote(
      defineComponent(
        () => () =>
          h(ModalTrigger, { isDefaultOpen: true }, () => [
            h(Button, null, () => "Open"),
            h(Modal, null, () => [
              h(Heading, null, () => "Squadron"),
              h(Content, null, () => h(LeaveButton)),
            ]),
          ]),
      ),
    );

    await page.getByRole("button", { name: "Leave" }).click();

    await isClosed("Squadron");
  });

  test("builds a new one when asked not to reuse", async () => {
    let fromInside: unknown;
    let fromTrigger: unknown;
    const Probe = defineComponent(() => {
      fromInside = useModalController({ reuseControllerFromContext: false });
      fromTrigger = useModalController();
      return () => h(Text, null, () => "Probe");
    });

    renderRemote(
      defineComponent(
        () => () =>
          h(ModalTrigger, { isDefaultOpen: true }, () => [
            h(Button, null, () => "Open"),
            h(Modal, null, () => [
              h(Heading, null, () => "Squadron"),
              h(Content, null, () => h(Probe)),
            ]),
          ]),
      ),
    );

    await vi.waitFor(() => expect(fromTrigger).toBeDefined());
    expect(fromInside).not.toBe(fromTrigger);
  });
});
