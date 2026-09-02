import { testEnvironments } from "@/tests/lib/environments";
import { expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

/*
 * A `ModalTrigger` with a `MenuItem` trigger inside a `ContextMenu`: the menu
 * closes when the item is activated, so the modal must be rendered outside the
 * menu popover to survive that (#1074).
 *
 * The two environments hoist it in different trees. Locally the host-side
 * `ContextMenu` renders the outlet next to its popover. Remotely `ContextMenu`
 * runs on the host while `ModalTrigger`/`Modal` run in the extension, so the
 * extension-side remote `ContextMenu` renders the outlet as a sibling of
 * `flr-context-menu` — which puts the overlay outside the popover on the host
 * as well.
 */
test.each(testEnvironments)(
  "Modal opened from a MenuItem survives the ContextMenu closing (%s)",
  async ({ render, components }) => {
    const {
      Action,
      ActionGroup,
      Button,
      ContextMenu,
      ContextMenuTrigger,
      Content,
      Heading,
      MenuItem,
      Modal,
      ModalTrigger,
      Text,
    } = components;

    const onClose = vi.fn();

    await render(
      <ContextMenuTrigger>
        <Button data-testid="menuTrigger">Station actions</Button>
        <ContextMenu>
          <MenuItem>Rotate station</MenuItem>
          <ModalTrigger>
            <Modal onClose={onClose}>
              <Heading>Fire superlaser</Heading>
              <Content>
                <Text data-testid="modalText">
                  Confirm the firing solution.
                </Text>
              </Content>
              <ActionGroup>
                <Action closeModal>
                  <Button data-testid="abort">Abort</Button>
                </Action>
              </ActionGroup>
            </Modal>
            <MenuItem data-testid="modalTrigger">Fire superlaser</MenuItem>
          </ModalTrigger>
        </ContextMenu>
      </ContextMenuTrigger>,
    );

    await page.getByTestId("menuTrigger").click();
    await expect.element(page.getByRole("menu")).toBeInTheDocument();

    await page.getByTestId("modalTrigger").click();

    await expect.element(page.getByTestId("modalText")).toBeInTheDocument();
    await vi.waitFor(() =>
      expect(page.getByRole("menu")).not.toBeInTheDocument(),
    );

    // The hoisted overlay keeps its controller: it closes, and the handler
    // registered by the Modal still runs even though the menu is long gone.
    await userEvent.click(page.getByTestId("abort"));
    await vi.waitFor(() =>
      expect(page.getByTestId("modalText")).not.toBeInTheDocument(),
    );
    expect(onClose).toHaveBeenCalled();
  },
);
