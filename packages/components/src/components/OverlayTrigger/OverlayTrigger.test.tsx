import { render, screen } from "@testing-library/react";
import { Modal, ModalTrigger } from "@/components/Modal";
import React, { act } from "react";
import { Content } from "@/components/Content";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
import { Button } from "@/components/Button";
import MenuItem from "@/components/MenuItem";
import userEvent from "@/lib/dev/vitestUserEvent";
import { vitest } from "vitest";

beforeEach(() => {
  vitest.useFakeTimers({
    shouldAdvanceTime: true,
  });
});

test("Nested overlays are not opened by parent overlay trigger", async () => {
  render(
    <ModalTrigger>
      <Button>Open modal</Button>
      <Modal>
        <Content>
          <div>Modal content</div>
          <ContextMenuTrigger>
            <Button>Open menu</Button>
            <ContextMenu>
              <MenuItem id="1">Menu item</MenuItem>
            </ContextMenu>
          </ContextMenuTrigger>
        </Content>
      </Modal>
    </ModalTrigger>,
  );

  await act(() => userEvent.click(screen.getByText("Open modal")));

  await screen.findByText("Modal content");
  expect(screen.queryByText("Menu item")).not.toBeInTheDocument();
});
