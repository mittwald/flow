import Action from "@/components/Action";
import ActionGroup from "@/components/ActionGroup";
import Button from "@/components/Button";
import Content from "@/components/Content";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
import Heading from "@/components/Heading";
import MenuItem from "@/components/MenuItem";
import ModalTrigger from "@/components/Modal/components/ModalTrigger";
import Modal from "@/components/Modal/Modal";
import Text from "@/components/Text";
import { useModalController } from "@/lib/controller";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

const modalContent = (
  <>
    <Heading>Fire superlaser</Heading>
    <Content>
      <Text data-testid="modal-text">Confirm the firing solution.</Text>
    </Content>
    <ActionGroup>
      <Action closeModal>
        <Button>Abort</Button>
      </Action>
    </ActionGroup>
  </>
);

const MenuItemTriggerTest = () => (
  <ContextMenuTrigger>
    <Button>Station actions</Button>
    <ContextMenu>
      <MenuItem>Rotate station</MenuItem>
      <ModalTrigger>
        <Modal>{modalContent}</Modal>
        <MenuItem>Fire superlaser</MenuItem>
      </ModalTrigger>
    </ContextMenu>
  </ContextMenuTrigger>
);

test("MenuItem in ModalTrigger closes the menu and opens the modal", async () => {
  const dom = await render(<MenuItemTriggerTest />);

  const menuTrigger = dom.getByRole("button", { name: "Station actions" });
  const menu = dom.getByRole("menu");
  const menuItem = dom.getByRole("menuitem", { name: "Fire superlaser" });
  const modal = dom.getByRole("dialog", { name: "Fire superlaser" });
  const modalText = dom.getByTestId("modal-text");

  await userEvent.click(menuTrigger);
  await expect.element(menu).toBeInTheDocument();
  expect(modal).not.toBeInTheDocument();

  await userEvent.click(menuItem);

  // The menu is gone – and the modal it opened is not gone with it
  await expect.element(modal).toBeInTheDocument();
  expect(menu).not.toBeInTheDocument();
  expect(modalText).toBeInTheDocument();
});

test("Modal opened from a MenuItem is not dropped when the menu is reopened", async () => {
  const dom = await render(<MenuItemTriggerTest />);

  const menuTrigger = dom.getByRole("button", { name: "Station actions" });
  const menuItem = dom.getByRole("menuitem", { name: "Fire superlaser" });
  const abortButton = dom.getByRole("button", { name: "Abort", exact: true });
  const modalText = dom.getByTestId("modal-text");

  for (const ignoredRun of [1, 2]) {
    await userEvent.click(menuTrigger);
    await userEvent.click(menuItem);
    await expect.element(modalText).toBeInTheDocument();

    // Exactly one modal – the hoisted overlay is replaced, not accumulated
    expect(
      document.querySelectorAll('[data-testid="modal-text"]'),
    ).toHaveLength(1);

    await userEvent.click(abortButton);
    await vitest.waitFor(() => expect(modalText).not.toBeInTheDocument());
  }
});

test("MenuItem in ModalTrigger opens the modal via keyboard and restores focus", async () => {
  const dom = await render(<MenuItemTriggerTest />);

  const menuTrigger = dom.getByRole("button", { name: "Station actions" });
  const modal = dom.getByRole("dialog", { name: "Fire superlaser" });
  const modalText = dom.getByTestId("modal-text");

  await userEvent.click(menuTrigger);
  await userEvent.keyboard("{ArrowDown}{ArrowDown}{Enter}");

  await expect.element(modal).toBeInTheDocument();

  // Focus moved into the modal
  await vitest.waitFor(() => {
    const modalElement = document
      .querySelector('[data-testid="modal-text"]')
      ?.closest('[role="dialog"]');
    expect(modalElement?.contains(document.activeElement)).toBe(true);
  });

  await userEvent.keyboard("{Escape}");
  await vitest.waitFor(() => expect(modalText).not.toBeInTheDocument());

  // Focus returns to the element that opened the menu
  await vitest.waitFor(() =>
    expect(document.activeElement).toBe(
      document.querySelector("button[aria-haspopup]"),
    ),
  );
});

test("Modal controlled by a controller from a MenuItem still behaves the same", async () => {
  const ControllerTest = () => {
    const controller = useModalController();

    return (
      <>
        <ContextMenuTrigger>
          <Button>Station actions</Button>
          <ContextMenu>
            <MenuItem onAction={() => controller.open()}>
              Fire superlaser
            </MenuItem>
          </ContextMenu>
        </ContextMenuTrigger>
        <Modal controller={controller}>{modalContent}</Modal>
      </>
    );
  };

  const dom = await render(<ControllerTest />);

  const menuTrigger = dom.getByRole("button", { name: "Station actions" });
  const menu = dom.getByRole("menu");
  const menuItem = dom.getByRole("menuitem", { name: "Fire superlaser" });
  const modalText = dom.getByTestId("modal-text");
  const abortButton = dom.getByRole("button", { name: "Abort", exact: true });

  await userEvent.click(menuTrigger);
  await userEvent.click(menuItem);

  await expect.element(modalText).toBeInTheDocument();
  expect(menu).not.toBeInTheDocument();

  await userEvent.click(abortButton);
  await vitest.waitFor(() => expect(modalText).not.toBeInTheDocument());
});
