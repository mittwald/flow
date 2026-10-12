import { testEnvironments } from "@/tests/lib/environments";
import { expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

/*
 * #1074. Locally the host `ContextMenu` hoists the modal; remotely the
 * extension-side `ContextMenu` does (`@flr-hoist-overlays`), because
 * `ModalTrigger`/`Modal` run in the extension.
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
