import Button from "@/components/Button";
import TextField, { type TextFieldProps } from "@/components/TextField";
import { Render } from "@/index/default";
import {
  Field,
  Form,
  typedField,
  useFormContext,
  type FormProps,
} from "@/integrations/react-hook-form";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { FC } from "react";
import { useForm } from "react-hook-form";

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
    [undefined, {}, "changed", undefined, ""],
    [undefined, {}, "changed", "resetted", "resetted"],
  ])(
    "when field with form default value '%s' and props '%s' changes to '%s' has the value '%s' after reset",
    async (initial, fieldProps = {}, changedTo, resetsTo, expected) => {
      const defaultValue = fieldProps.defaultValue;
      initialValue = initial;
      resetValueTo = resetsTo;
      render(<TestForm textField={fieldProps} />);

      const user = userEvent.setup();
      const field = screen.getByLabelText("test");
      const resetButton = screen.getByText("Reset");

      expect(field).toHaveDisplayValue(defaultValue ?? initial ?? "");

      await user.type(field, changedTo);
      expect(field).toHaveDisplayValue(
        (defaultValue ?? initial ?? "") + (changedTo ?? ""),
      );

      await user.click(resetButton);
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
          <TextField placeholder="textfield" />
        </Field>
        <Render>
          {() => {
            const ctx = useFormContext();
            return (
              <Button
                data-testid="toggle-readonly"
                onPress={() => ctx.setReadonly((prev) => !prev)}
              >
                Toggle readonly
              </Button>
            );
          }}
        </Render>
      </Form>
    );
  };

  test("readonly prop cascades to fields", () => {
    render(<TestForm isReadOnly />);
    const textfield = screen.getByPlaceholderText("textfield");
    expect(textfield.hasAttribute("readonly")).toBe(true);
  });

  test("toggling readonly via context works", async () => {
    render(<TestForm />);
    const toggleButton = screen.getByTestId("toggle-readonly");
    const textfield = screen.getByPlaceholderText("textfield");

    expect(textfield.hasAttribute("readonly")).toBe(false);
    await userEvent.click(toggleButton);
    expect(textfield.hasAttribute("readonly")).toBe(true);
  });
});
