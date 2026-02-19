import Action from "@/components/Action";
import ActionGroup from "@/components/ActionGroup";
import Button from "@/components/Button";
import Content from "@/components/Content";
import ModalTrigger from "@/components/Modal/components/ModalTrigger";
import Modal from "@/components/Modal/Modal";
import Text from "@/components/Text";
import TextField from "@/components/TextField";
import {
  Field,
  flags,
  Form,
  SubmitButton,
} from "@/integrations/react-hook-form";
import { resetFlags } from "@/integrations/react-hook-form/flags";
import { useModalController } from "@/lib/controller";
import { useForm } from "react-hook-form";
import { render } from "vitest-browser-react";
import { userEvent } from "vitest/browser";

afterEach(() => {
  resetFlags();
});

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

test("Modal with dirty form requires confirmation", async () => {
  flags.requireCloseModalConfirmationOnUnsavedChanges = true;

  const Test = () => {
    const form = useForm();

    return (
      <ModalTrigger>
        <Button>Open Modal</Button>
        <Modal>
          <Content>
            <Text data-testid="modal-text">Hello World</Text>
            <Form form={form} onSubmit={vitest.fn()}>
              <Field name="testField">
                <TextField />
              </Field>
              <Action closeModal>
                <SubmitButton showFeedback={false}>Submit</SubmitButton>
                <Button>Try close</Button>
              </Action>
            </Form>
          </Content>
        </Modal>
      </ModalTrigger>
    );
  };

  const dom = await render(<Test />);

  const modalText = dom.getByTestId("modal-text");
  const submitButton = dom.getByRole("button", { name: "Submit", exact: true });
  const openModalButton = dom.getByRole("button", {
    name: "Open Modal",
    exact: true,
  });
  const tryCloseModalButton = dom.getByRole("button", {
    name: "Try close",
    exact: true,
  });
  const confirmCloseModalButton = dom.getByRole("button", {
    name: "Close",
    exact: true,
  });
  const cancelConfirmCloseModalButton = dom.getByRole("button", {
    name: "Keep editing",
    exact: true,
  });
  const input = dom.getByRole("textbox");

  await userEvent.click(openModalButton);
  await userEvent.type(input, "Some changes");
  await userEvent.click(tryCloseModalButton);
  expect(modalText).toBeInTheDocument();

  await userEvent.click(cancelConfirmCloseModalButton);
  expect(modalText).toBeInTheDocument();

  await userEvent.click(tryCloseModalButton);
  await userEvent.click(confirmCloseModalButton);
  expect(modalText).not.toBeInTheDocument();

  await userEvent.click(openModalButton);
  await userEvent.click(submitButton);
  expect(modalText).not.toBeInTheDocument();
});

test("Modal with dirty form does not require confirmation when using abort button", async () => {
  flags.requireCloseModalConfirmationOnUnsavedChanges = true;

  const Test = () => {
    const form = useForm();

    return (
      <Modal isDefaultOpen>
        <Content>
          <Text data-testid="modal-text">Hello World</Text>
          <Form form={form} onSubmit={vitest.fn()}>
            <Field name="testField">
              <TextField />
            </Field>
          </Form>
        </Content>
        <ActionGroup>
          <Action closeModal>
            <Button>Abort</Button>
          </Action>
          <Action closeOverlay="Modal">
            <Button>Abort #2</Button>
          </Action>
        </ActionGroup>
      </Modal>
    );
  };

  for (const buttonName of ["Abort", "Abort #2"]) {
    const dom = await render(<Test />);

    const modalText = dom.getByTestId("modal-text");
    const abortButton = dom.getByRole("button", {
      name: buttonName,
      exact: true,
    });
    const input = dom.getByRole("textbox");

    await userEvent.type(input, "Some changes");
    await userEvent.click(abortButton);
    expect(modalText).not.toBeInTheDocument();
  }
});

test("Modal supports function as children", async () => {
  const dom = await render(
    <Modal isOpen>
      {() => (
        <Content>
          <Text data-testid="modal-text">Hello World</Text>
        </Content>
      )}
    </Modal>,
  );

  const modalText = dom.getByTestId("modal-text");
  expect(modalText).toBeInTheDocument();
});

test("Modal can be closed with render props", async () => {
  const dom = await render(
    <Modal isDefaultOpen>
      {({ controller }) => (
        <Content>
          <Text data-testid="modal-text">Hello World</Text>
          <Button onPress={() => controller.close()}>Close</Button>
        </Content>
      )}
    </Modal>,
  );

  const modalText = dom.getByTestId("modal-text");
  const closeButton = dom.getByRole("button", { name: "Close", exact: true });
  expect(modalText).toBeInTheDocument();
  await userEvent.click(closeButton);
  expect(modalText).not.toBeInTheDocument();
});
