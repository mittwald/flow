import { render } from "vitest-browser-react";
import { Modal, ModalTrigger } from "@/components/Modal";
import { Content } from "@/components/Content";
import { ContextMenu, ContextMenuTrigger } from "@/components/ContextMenu";
import { Button } from "@/components/Button";
import MenuItem from "@/components/MenuItem";
import { page } from "vitest/browser";

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

  await page.getByText("Open modal").click();

  expect(page.getByText("Modal content")).toBeInTheDocument();
  expect(page.getByText("Menu item")).not.toBeInTheDocument();
});
