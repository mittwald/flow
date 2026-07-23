import Action from "@/components/Action";
import ActionGroup from "@/components/ActionGroup";
import Button from "@/components/Button";
import Content from "@/components/Content";
import Heading from "@/components/Heading";
import Label from "@/components/Label";
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
import { resetFlags } from "@/flags";
import { useModalController } from "@/lib/controller";
import { useForm } from "react-hook-form";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { Render } from "../public";
import { commands } from "vitest/browser";
import { sleep } from "@/lib/promises/sleep";

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

test("Modal with resetted form does not require confirmation", async () => {
  flags.requireCloseModalConfirmationOnUnsavedChanges = true;

  const Test = () => {
    const form = useForm();

    return (
      <Modal isDefaultOpen>
        <Content>
          <Text data-testid="modal-text">Hello World</Text>
          <Form form={form} onSubmit={vitest.fn()}>
            <Field name="testField" defaultValue="">
              <TextField />
            </Field>
            <Action closeModal>
              <Button>Try close</Button>
            </Action>
            <Action onAction={() => form.reset()}>
              <Button>Reset form</Button>
            </Action>
          </Form>
        </Content>
      </Modal>
    );
  };

  const dom = await render(<Test />);

  const modalText = dom.getByTestId("modal-text");
  const tryCloseModalButton = dom.getByRole("button", {
    name: "Try close",
    exact: true,
  });
  const resetFormButton = dom.getByRole("button", {
    name: "Reset form",
    exact: true,
  });
  const input = dom.getByRole("textbox");

  await userEvent.type(input, "Some changes");
  await userEvent.click(resetFormButton);
  await userEvent.click(tryCloseModalButton);
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

test("useOnClosed is called when the closing animation has finished", async () => {
  // Activating animations
  await commands.setReducedMotion("no-preference");

  const onClosed = vitest.fn();

  const ui = (
    <Modal isDefaultOpen>
      <Render>
        {() => {
          useModalController().useOnClosed(onClosed);
        }}
      </Render>
      <Content>
        <Text data-testid="modal-text">Hello World</Text>
      </Content>
      <ActionGroup>
        <Action closeModal>
          <Button>Close</Button>
        </Action>
      </ActionGroup>
    </Modal>
  );

  const dom = await render(ui);

  const closeButton = dom.getByRole("button", {
    name: "Close",
    exact: true,
  });
  const modalText = dom.getByTestId("modal-text");

  expect(modalText).toBeInTheDocument();
  expect(onClosed).not.toHaveBeenCalled();

  await userEvent.click(closeButton);
  await sleep(50);

  expect(modalText).toBeInTheDocument();
  expect(onClosed).not.toHaveBeenCalledOnce();

  // Wait for the close animation to finish and the Modal to unmount instead of
  // relying on a fixed delay: the animation duration varies and a hard-coded
  // sleep races against it under CI load, which made this test flaky.
  await vitest.waitFor(() => expect(modalText).not.toBeInTheDocument(), {
    timeout: 2000,
  });

  // onClosed is just called, when the Modal has unmounted (after close animation)
  expect(onClosed).toHaveBeenCalledOnce();
});

test("Form in Modal is auto-resetted on close", async () => {
  const Test = () => {
    const form = useForm();

    return (
      <ModalTrigger>
        <Button>Open Modal</Button>
        <Modal>
          <Content>
            {form.formState.isDirty && (
              <Text data-testid="is-dirty">is dirty</Text>
            )}
            <Form form={form} onSubmit={vitest.fn()}>
              <Field name="testField" defaultValue="">
                <TextField />
              </Field>
            </Form>
          </Content>
          <ActionGroup>
            <Action closeModal>
              <Button>Close modal</Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>
    );
  };

  const dom = await render(<Test />);

  const isDirtyText = dom.getByTestId("is-dirty");
  const closeButton = dom.getByRole("button", {
    name: "Close modal",
    exact: true,
  });
  const openModalButton = dom.getByRole("button", {
    name: "Open Modal",
    exact: true,
  });
  const input = dom.getByRole("textbox");

  await userEvent.click(openModalButton);
  await userEvent.fill(input, "Some changes");
  expect(isDirtyText).toBeInTheDocument();
  await userEvent.click(closeButton);
  await userEvent.click(openModalButton);
  expect(isDirtyText).not.toBeInTheDocument();
});

test("Form in Modal is not auto-resetted on close when opted-out", async () => {
  const Test = () => {
    const form = useForm();

    return (
      <ModalTrigger>
        <Button>Open Modal</Button>
        <Modal>
          <Content>
            {form.formState.isDirty && (
              <Text data-testid="is-dirty">is dirty</Text>
            )}
            <Form form={form} onSubmit={vitest.fn()} autoReset={false}>
              <Field name="testField" defaultValue="">
                <TextField />
              </Field>
            </Form>
          </Content>
          <ActionGroup>
            <Action closeModal>
              <Button>Close modal</Button>
            </Action>
          </ActionGroup>
        </Modal>
      </ModalTrigger>
    );
  };

  const dom = await render(<Test />);

  const isDirtyText = dom.getByTestId("is-dirty");
  const closeButton = dom.getByRole("button", {
    name: "Close modal",
    exact: true,
  });
  const openModalButton = dom.getByRole("button", {
    name: "Open Modal",
    exact: true,
  });
  const input = dom.getByRole("textbox");

  await userEvent.click(openModalButton);
  await userEvent.fill(input, "Some changes");
  expect(isDirtyText).toBeInTheDocument();
  await userEvent.click(closeButton);
  await userEvent.click(openModalButton);
  expect(isDirtyText).toBeInTheDocument();
});

test("browser extension UI stays interactive while a modal is open", async () => {
  await render(
    <Modal isOpen>
      <Content>
        <Text>Hello World</Text>
      </Content>
    </Modal>,
  );

  const customElement = document.createElement("some-extension-overlay");
  const shadowHost = document.createElement("div");
  shadowHost.attachShadow({ mode: "open" });

  for (const node of [customElement, shadowHost]) {
    node.inert = true;
    node.setAttribute("aria-hidden", "true");
  }
  document.body.append(customElement, shadowHost);

  try {
    await vitest.waitFor(() => {
      for (const node of [customElement, shadowHost]) {
        expect(node.hasAttribute("data-react-aria-top-layer")).toBe(true);
        expect(node.inert).toBe(false);
        expect(node.hasAttribute("aria-hidden")).toBe(false);
      }
    });
  } finally {
    customElement.remove();
    shadowHost.remove();
  }
});

test("unrelated background nodes stay isolated while a modal is open", async () => {
  await render(
    <Modal isOpen>
      <Content>
        <Text>Hello World</Text>
      </Content>
    </Modal>,
  );

  const background = document.createElement("div");
  document.body.append(background);

  try {
    await vitest.waitFor(() => expect(background.inert).toBe(true));
    expect(background.hasAttribute("data-react-aria-top-layer")).toBe(false);
  } finally {
    background.remove();
  }
});

test("mobile Modal is a single scroll container with sticky header and footer", async () => {
  try {
    await page.viewport(375, 500);

    await render(
      <Modal isOpen>
        <Heading>New Squadron</Heading>
        <Content>
          {Array.from({ length: 12 }, (_, index) => (
            <TextField key={index}>
              <Label>Pilot {index + 1}</Label>
            </TextField>
          ))}
        </Content>
        <ActionGroup>
          <Action closeModal>
            <Button>Create squadron</Button>
          </Action>
        </ActionGroup>
      </Modal>,
    );

    const dialog = document.querySelector('[role="dialog"]') as HTMLElement;
    const header = dialog.querySelector(
      '[class*="modal--header"]',
    ) as HTMLElement;
    const footer = dialog.querySelector(
      '[class*="action-group"]',
    ) as HTMLElement;

    // the content overflows, and the dialog itself is the scroll container
    await vitest.waitFor(() => {
      expect(dialog.scrollHeight).toBeGreaterThan(dialog.clientHeight);
    });
    expect(getComputedStyle(dialog).overflowY).toBe("auto");

    // at rest the header sticks to the top and the footer to the bottom
    expect(getComputedStyle(header).position).toBe("sticky");
    expect(getComputedStyle(footer).position).toBe("sticky");
  } finally {
    await page.viewport(1280, 720);
  }
});
