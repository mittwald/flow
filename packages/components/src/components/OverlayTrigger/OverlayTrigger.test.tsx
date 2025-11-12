import { render, screen } from "@testing-library/react";
import { Modal, ModalTrigger } from "@/components/Modal";
import React, { act } from "react";
import { Content } from "@/components/Content";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
import { Button } from "@/components/Button";
import MenuItem from "@/components/MenuItem";
import { vitest } from "vitest";
import { userEventFakeTimer } from "@/lib/dev/vitest";

beforeEach(() => {
  vitest.useFakeTimers();
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

  await act(() => userEventFakeTimer.click(screen.getByText("Open modal")));

  await screen.findByText("Modal content");
  expect(screen.queryByText("Menu item")).not.toBeInTheDocument();
});
