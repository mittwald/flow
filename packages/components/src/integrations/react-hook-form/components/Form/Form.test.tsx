import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { Form, typedField } from "@/integrations/react-hook-form";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  const TestForm = () => {
    const form = useForm<Values>({
      defaultValues: initialValue
        ? {
            test: initialValue,
          }
        : undefined,
    });
    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={(values) => handleSubmit(values)}>
        <Field name="test">
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

  test.each([
    ["initial", "changed", "resetted", "resetted"],
    ["initial", "changed", undefined, "initial"],
    [undefined, "changed", undefined, ""],
    [undefined, "changed", "resetted", "resetted"],
  ])(
    "when field with form default value '%s' changes to '%s' has the value '%s' after reset",
    async (initial, changedTo, resetsTo, expected) => {
      initialValue = initial;
      resetValueTo = resetsTo;
      render(<TestForm />);

      const user = userEvent.setup();
      const field = screen.getByLabelText("test");
      const resetButton = screen.getByText("Reset");

      expect(field).toHaveDisplayValue(initial ?? "");

      await user.type(field, changedTo);
      expect(field).toHaveDisplayValue((initial ?? "") + (changedTo ?? ""));

      await user.click(resetButton);
      expect(field).toHaveDisplayValue(expected);
    },
  );
});
