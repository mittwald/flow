import Button from "@/components/Button";
import TextField, { type TextFieldProps } from "@/components/TextField";
import {
  Field,
  Form,
  SubmitButton,
  typedField,
  useFormContext,
  type FormProps,
} from "@/integrations/react-hook-form";
import { Render } from "@/lib/react/components/Render";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

const handleSubmit = vitest.fn();

beforeEach(() => {
  vitest.resetAllMocks();
});

describe("resetting", () => {
  interface Values {
    test: string;
  }

  let resetValueTo: string | undefined;
  let initialValue: string | undefined;

  beforeEach(() => {
    resetValueTo = undefined;
    initialValue = undefined;
  });

  const TestForm = (props: {
    textField?: TextFieldProps;
    form?: FormProps<Values>;
  }) => {
    const form = useForm<Values>({
      defaultValues: initialValue
        ? {
            test: initialValue,
          }
        : undefined,
      ...props.form,
    });
    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={(values) => handleSubmit(values)}>
        <Field {...props.textField} name="test">
          <TextField aria-label="test" />
        </Field>
        <Button
          onPress={() => {
            if (resetValueTo) {
              form.reset({
                test: resetValueTo,
              });
            } else {
              form.reset();
            }
          }}
        >
          Reset
        </Button>
      </Form>
    );
  };

  test.each<
    [string | undefined, TextFieldProps, string, string | undefined, string]
  >([
    ["initial", {}, "changed", "resetted", "resetted"],
    ["initial", {}, "changed", undefined, "initial"],
    [
      undefined,
      {
        defaultValue: "initialProp",
      },
      "changed",
      undefined,
      "initialProp",
    ],
    [undefined, {}, "changed", undefined, "changed"],
    [undefined, {}, "changed", "resetted", "resetted"],
  ])(
    "when field with form default value '%s' and props '%s' changes to '%s' and resets to '%s' has the value '%s' after reset",
    async (initial, fieldProps = {}, changedTo, resetsTo, expected) => {
      const defaultValue = fieldProps.defaultValue;
      initialValue = initial;
      resetValueTo = resetsTo;
      await render(<TestForm textField={fieldProps} />);

      const field = page.getByLabelText("test");
      const resetButton = page.getByText("Reset");

      expect(field).toHaveDisplayValue(defaultValue ?? initial ?? "");

      await userEvent.type(field, changedTo);
      expect(field).toHaveDisplayValue(
        (defaultValue ?? initial ?? "") + (changedTo ?? ""),
      );

      await userEvent.click(resetButton);
      expect(field).toHaveDisplayValue(expected);
    },
  );
});

describe("readonly", () => {
  const TestForm: FC<Partial<FormProps<object>>> = (props) => {
    const form = useForm<object>();
    return (
      <Form
        {...props}
        form={form}
        onSubmit={() => {
          // void
        }}
      >
        <Field name="test">
          <TextField placeholder="textfield" aria-label="test" />
        </Field>
        <Render>
          {() => {
            const ctx = useFormContext();
            return (
              <Button
                data-testid="toggle-readonly"
                onPress={() => ctx.setReadOnly((prev) => !prev)}
              >
                Toggle readonly
              </Button>
            );
          }}
        </Render>
      </Form>
    );
  };

  test("readonly prop cascades to fields", async () => {
    await render(<TestForm isReadOnly />);
    const textfield = page.getByPlaceholder("textfield");
    expect(textfield).toHaveAttribute("readonly");
  });

  test("toggling readonly via context works", async () => {
    await render(<TestForm />);
    const toggleButton = page.getByTestId("toggle-readonly");
    const textfield = page.getByPlaceholder("textfield");

    expect(textfield).not.toHaveAttribute("readonly");
    await userEvent.click(toggleButton);
    expect(textfield).toHaveAttribute("readonly");
  });
});

describe("error", () => {
  const TestForm: FC<Omit<FormProps<object>, "form">> = (props) => {
    const form = useForm<object>();
    return (
      <Form {...props} form={form}>
        <Field name="test">
          <TextField placeholder="textfield" aria-label="test" />
        </Field>
        <SubmitButton data-testid="submit-button">Submit</SubmitButton>
      </Form>
    );
  };

  test("form submission error leads to unhandledrejection event", async () => {
    const errorHandler = vitest.fn();

    window.addEventListener("unhandledrejection", errorHandler);

    await render(
      <TestForm
        onSubmit={() => {
          throw new Error("Submission failed");
        }}
      />,
    );

    const submitButton = page.getByTestId("submit-button");
    await userEvent.click(submitButton);

    expect(errorHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: expect.objectContaining({
          message: "Submission failed",
        }),
      }),
    );

    window.removeEventListener("unhandledrejection", errorHandler);
  });
});
