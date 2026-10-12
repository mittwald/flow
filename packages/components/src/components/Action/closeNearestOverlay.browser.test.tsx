import Action from "@/components/Action";
import Button from "@/components/Button";
import Content from "@/components/Content";
import Modal from "@/components/Modal/Modal";
import ModalTrigger from "@/components/Modal/components/ModalTrigger";
import Popover from "@/components/Popover/Popover";
import PopoverTrigger from "@/components/Popover/components/PopoverTrigger";
import Text from "@/components/Text";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

test("closeOverlay closes the surrounding modal without naming it", async () => {
  const dom = await render(
    <Modal isDefaultOpen>
      <Content>
        <Text data-testid="modal-text">Modal</Text>
        <Action closeOverlay>
          <Button>Close nearest</Button>
        </Action>
      </Content>
    </Modal>,
  );

  const modalText = dom.getByTestId("modal-text");
  await userEvent.click(dom.getByRole("button", { name: "Close nearest" }));

  expect(modalText).not.toBeInTheDocument();
});

test("closeOverlay closes the surrounding popover without naming it", async () => {
  const dom = await render(
    <PopoverTrigger>
      <Button>Open popover</Button>
      <Popover>
        <Text data-testid="popover-text">Popover</Text>
        <Action closeOverlay>
          <Button>Close nearest</Button>
        </Action>
      </Popover>
    </PopoverTrigger>,
  );

  await userEvent.click(dom.getByRole("button", { name: "Open popover" }));
  const popoverText = dom.getByTestId("popover-text");
  await userEvent.click(dom.getByRole("button", { name: "Close nearest" }));

  expect(popoverText).not.toBeInTheDocument();
});

test("closeOverlay closes the inner overlay, not the outer one", async () => {
  const dom = await render(
    <Modal isDefaultOpen>
      <Content>
        <Text data-testid="modal-text">Modal</Text>
        <PopoverTrigger>
          <Button>Open popover</Button>
          <Popover>
            <Text data-testid="popover-text">Popover</Text>
            <Action closeOverlay>
              <Button>Close nearest</Button>
            </Action>
          </Popover>
        </PopoverTrigger>
      </Content>
    </Modal>,
  );

  await userEvent.click(dom.getByRole("button", { name: "Open popover" }));
  const popoverText = dom.getByTestId("popover-text");
  await userEvent.click(dom.getByRole("button", { name: "Close nearest" }));

  expect(popoverText).not.toBeInTheDocument();
  await expect.element(dom.getByTestId("modal-text")).toBeInTheDocument();
});

test("an explicit name still wins over the nearest overlay", async () => {
  const dom = await render(
    <Modal isDefaultOpen>
      <Content>
        <Text data-testid="modal-text">Modal</Text>
        <PopoverTrigger>
          <Button>Open popover</Button>
          <Popover>
            <Text data-testid="popover-text">Popover</Text>
            <Action closeOverlay="Modal">
              <Button>Close modal</Button>
            </Action>
          </Popover>
        </PopoverTrigger>
      </Content>
    </Modal>,
  );

  await userEvent.click(dom.getByRole("button", { name: "Open popover" }));
  const modalText = dom.getByTestId("modal-text");
  await userEvent.click(dom.getByRole("button", { name: "Close modal" }));

  expect(modalText).not.toBeInTheDocument();
});

/*
 * `OverlayTrigger` wraps the trigger as well as the overlay. The trigger is not
 * inside the overlay it opens, so the nearest overlay there is the one the
 * trigger itself sits in – here the outer modal.
 */
test("a trigger's subtree is not inside the overlay the trigger opens", async () => {
  const dom = await render(
    <Modal isDefaultOpen>
      <Content>
        <Text data-testid="modal-text">Modal</Text>
        <ModalTrigger>
          <Action closeOverlay>
            <Button>Trigger</Button>
          </Action>
          <Modal>
            <Content>
              <Text data-testid="inner-modal-text">Inner modal</Text>
            </Content>
          </Modal>
        </ModalTrigger>
      </Content>
    </Modal>,
  );

  const modalText = dom.getByTestId("modal-text");
  await userEvent.click(dom.getByRole("button", { name: "Trigger" }));

  expect(modalText).not.toBeInTheDocument();
});
