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
import { Field, Form, SubmitButton } from "@/integrations/react-hook-form";
import { ComponentDefaultsProvider } from "@/components/ComponentDefaultsProvider";
import { useModalController } from "@/lib/controller";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";
import { Render } from "../public";
import { commands } from "vitest/browser";
import { sleep } from "@/lib/promises/sleep";

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

test("Modal keeps requiring confirmation after a submit that does not close it", async () => {
  const Test = () => {
    const form = useForm();
    const [step, setStep] = useState<"one" | "two">("one");

    return (
      <Modal isDefaultOpen>
        <Content>
          <Text data-testid="modal-text">Hello World</Text>
          <Form form={form} onSubmit={() => setStep("two")}>
            {step === "one" && (
              <Field name="testField">
                <TextField />
              </Field>
            )}
            {step === "two" && <Text data-testid="step-two">Step two</Text>}
            <SubmitButton showFeedback={false}>Continue</SubmitButton>
          </Form>
        </Content>
      </Modal>
    );
  };

  const dom = await render(<Test />);

  const modalText = dom.getByTestId("modal-text");
  const stepTwoText = dom.getByTestId("step-two");
  const continueButton = dom.getByRole("button", {
    name: "Continue",
    exact: true,
  });
  const cancelConfirmCloseModalButton = dom.getByRole("button", {
    name: "Keep editing",
    exact: true,
  });
  const input = dom.getByRole("textbox");

  await userEvent.type(input, "Some changes");

  // The confirmation is armed while the form is dirty
  await userEvent.keyboard("{Escape}");
  await userEvent.click(cancelConfirmCloseModalButton);
  expect(modalText).toBeInTheDocument();

  // Advancing the wizard does not save anything – the unsaved input is still at
  // risk, so the confirmation must stay armed
  await userEvent.click(continueButton);
  await expect.element(stepTwoText).toBeInTheDocument();

  await userEvent.keyboard("{Escape}");
  await expect.element(cancelConfirmCloseModalButton).toBeInTheDocument();
  expect(modalText).toBeInTheDocument();
});

test("Modal closed by its own Form submit needs no confirmation", async () => {
  // Every way a Form submit can end up closing the surrounding Modal – all of
  // them must get through without the "unsaved changes" confirmation, even
  // though the form is dirty at the time of the submit.
  const variants = {
    "synchronously in onSubmit": {
      onSubmit: (close: () => void) => () => close(),
      showFeedback: false,
    },
    "after an awaited async onSubmit": {
      onSubmit: (close: () => void) => async () => {
        await sleep(10);
        close();
      },
      showFeedback: false,
    },
    "in the after-submit callback": {
      onSubmit: (close: () => void) => () => close,
      showFeedback: false,
    },
    "in the after-submit callback, with success feedback": {
      onSubmit: (close: () => void) => () => close,
      showFeedback: true,
    },
  };

  for (const [variant, { onSubmit, showFeedback }] of Object.entries(
    variants,
  )) {
    const Test = () => {
      const controller = useModalController({ isDefaultOpen: true });
      const form = useForm();

      return (
        <Modal controller={controller}>
          <Content>
            <Text data-testid="modal-text">Hello World</Text>
            <Form form={form} onSubmit={onSubmit(() => controller.close())}>
              <Field name="testField">
                <TextField />
              </Field>
              <SubmitButton showFeedback={showFeedback}>Save</SubmitButton>
            </Form>
          </Content>
        </Modal>
      );
    };

    const dom = await render(<Test />);

    const modalText = dom.getByTestId("modal-text");
    const saveButton = dom.getByRole("button", { name: "Save", exact: true });
    const input = dom.getByRole("textbox");

    await userEvent.type(input, "Some changes");
    await userEvent.click(saveButton);

    await vitest.waitFor(() =>
      expect(modalText, variant).not.toBeInTheDocument(),
    );
  }
});

test("Modal with resetted form does not require confirmation", async () => {
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

test("Modal with dirty form does not require confirmation when the default is switched off", async () => {
  const Test = () => {
    const form = useForm();

    return (
      <ComponentDefaultsProvider
        defaults={{ Form: { confirmModalCloseOnUnsavedChanges: false } }}
      >
        <Modal isDefaultOpen>
          <Content>
            <Text data-testid="modal-text">Hello World</Text>
            <Form form={form} onSubmit={vitest.fn()}>
              <Field name="testField">
                <TextField />
              </Field>
              <Action closeModal>
                <Button>Try close</Button>
              </Action>
            </Form>
          </Content>
        </Modal>
      </ComponentDefaultsProvider>
    );
  };

  const dom = await render(<Test />);

  const modalText = dom.getByTestId("modal-text");
  const tryCloseModalButton = dom.getByRole("button", {
    name: "Try close",
    exact: true,
  });
  const input = dom.getByRole("textbox");

  await userEvent.type(input, "Some changes");
  await userEvent.click(tryCloseModalButton);
  expect(modalText).not.toBeInTheDocument();
});

test("Modal with confirmOnClose requires confirmation", async () => {
  const dom = await render(
    <Modal isDefaultOpen confirmOnClose>
      <Content>
        <Text data-testid="modal-text">Hello World</Text>
        <Action closeModal>
          <Button>Try close</Button>
        </Action>
      </Content>
    </Modal>,
  );

  const modalText = dom.getByTestId("modal-text");
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

  await userEvent.keyboard("{Escape}");
  expect(modalText).toBeInTheDocument();

  await userEvent.click(cancelConfirmCloseModalButton);
  expect(modalText).toBeInTheDocument();

  await userEvent.click(tryCloseModalButton);
  expect(modalText).toBeInTheDocument();

  await userEvent.click(confirmCloseModalButton);
  expect(modalText).not.toBeInTheDocument();
});

test("Modal only requires confirmation while confirmOnClose is enabled", async () => {
  const Test = () => {
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    return (
      <ModalTrigger>
        <Button>Open Modal</Button>
        <Modal confirmOnClose={hasUnsavedChanges}>
          <Content>
            <Text data-testid="modal-text">Hello World</Text>
            <Button onPress={() => setHasUnsavedChanges(true)}>
              Change something
            </Button>
            <Action closeModal>
              <Button>Try close</Button>
            </Action>
          </Content>
        </Modal>
      </ModalTrigger>
    );
  };

  const dom = await render(<Test />);

  const modalText = dom.getByTestId("modal-text");
  const openModalButton = dom.getByRole("button", {
    name: "Open Modal",
    exact: true,
  });
  const changeButton = dom.getByRole("button", {
    name: "Change something",
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

  // Nothing to lose yet: the modal closes right away
  await userEvent.click(openModalButton);
  await userEvent.click(tryCloseModalButton);
  expect(modalText).not.toBeInTheDocument();

  await userEvent.click(openModalButton);
  await userEvent.click(changeButton);
  await userEvent.click(tryCloseModalButton);
  expect(modalText).toBeInTheDocument();

  await userEvent.click(confirmCloseModalButton);
  expect(modalText).not.toBeInTheDocument();
});

test("Modal with confirmOnClose is not overruled by a contained Form", async () => {
  const Test = () => {
    const form = useForm();

    return (
      <Modal isDefaultOpen confirmOnClose>
        <Content>
          <Text data-testid="modal-text">Hello World</Text>
          <Form form={form} onSubmit={vitest.fn()}>
            <Field name="testField">
              <TextField />
            </Field>
          </Form>
          <Action closeModal>
            <Button>Try close</Button>
          </Action>
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
  const confirmCloseModalButton = dom.getByRole("button", {
    name: "Close",
    exact: true,
  });

  // The clean Form does not require a confirmation, but it must not disable the
  // one requested via the Modal prop either
  await userEvent.click(tryCloseModalButton);
  expect(modalText).toBeInTheDocument();

  await userEvent.click(confirmCloseModalButton);
  expect(modalText).not.toBeInTheDocument();
});

test("Modal with confirmOnClose still closes immediately via ActionGroup and close button", async () => {
  const withActionGroup = await render(
    <Modal isDefaultOpen confirmOnClose>
      <Content>
        <Text data-testid="modal-text">Hello World</Text>
      </Content>
      <ActionGroup>
        <Action closeModal>
          <Button>Abort</Button>
        </Action>
      </ActionGroup>
    </Modal>,
  );

  const modalTextWithActionGroup = withActionGroup.getByTestId("modal-text");
  await userEvent.click(
    withActionGroup.getByRole("button", { name: "Abort", exact: true }),
  );
  expect(modalTextWithActionGroup).not.toBeInTheDocument();

  const withCloseButton = await render(
    <Modal isDefaultOpen confirmOnClose>
      <Heading>Hello World</Heading>
      <Content>
        <Text data-testid="modal-text">Hello World</Text>
      </Content>
    </Modal>,
  );

  const modalTextWithCloseButton = withCloseButton.getByTestId("modal-text");
  await userEvent.click(
    withCloseButton.getByRole("button", { name: "Close", exact: true }),
  );
  expect(modalTextWithCloseButton).not.toBeInTheDocument();
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
