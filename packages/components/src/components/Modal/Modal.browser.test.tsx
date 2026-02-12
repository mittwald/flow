import Button from "@/components/Button";
import Content from "@/components/Content";
import Modal from "@/components/Modal/Modal";
import Text from "@/components/Text";
import { useModalController } from "@/lib/controller";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

test("Modal is open when using props", async () => {
  const dom = await render(
    <Modal isOpen>
      <Content>
        <Text data-testid="modal-text">Hello World</Text>
      </Content>
    </Modal>,
  );

  const modalText = dom.getByTestId("modal-text");
  expect(modalText).toBeInTheDocument();

  await dom.rerender(
    <Modal isOpen={false}>
      <Content>
        <Text data-testid="modal-text">Hello World</Text>
      </Content>
    </Modal>,
  );

  expect(modalText).not.toBeInTheDocument();
});

test("Modal can be controlled with modal controller", async () => {
  const Test = () => {
    const controller = useModalController();

    return (
      <>
        <Modal controller={controller}>
          <Content>
            <Text data-testid="modal-text">Hello World</Text>
          </Content>
        </Modal>
        <Button
          data-testid="open-modal-button"
          onPress={() => controller.open()}
        >
          Open Modal
        </Button>
      </>
    );
  };

  const dom = await render(<Test />);
  const modalText = dom.getByTestId("modal-text");
  const openModalButton = dom.getByTestId("open-modal-button");
  expect(modalText).not.toBeInTheDocument();

  await userEvent.click(openModalButton);
  expect(modalText).toBeInTheDocument();
});
