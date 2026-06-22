import { Button } from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { Label } from "@/components/Label";
import { Option } from "@/components/Option";
import { Select } from "@/components/Select";
import { Switch } from "@/components/Switch";
import TextField from "@/components/TextField";
import {
  Form,
  typedField,
  debounceValidate,
} from "@/integrations/react-hook-form";
import { useForm } from "react-hook-form";
import { beforeEach, expect, vitest } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

const handleSubmit = vitest.fn();

beforeEach(() => {
  vitest.resetAllMocks();
});

describe("Select field", () => {
  interface Values {
    select: "baz" | "bar" | "bam";
  }

  const TestForm = () => {
    const form = useForm<Values>();
    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={(values) => handleSubmit(values)}>
        <Button onPress={() => form.setValue("select", "bar")}>
          Set select
        </Button>
        <Field name="select">
          <Select data-testid="select">
            <Label>Select</Label>
            <Option value="baz">Baz</Option>
            <Option value="bar">Bar</Option>
            <Option value="bam">Bam</Option>
          </Select>
        </Field>
        <Button type="submit">Submit</Button>
      </Form>
    );
  };

  const ui = {
    setSelect: () => userEvent.click(page.getByText("Set select")),
    expectValueToBe: (val: string) =>
      expect(page.getByTestId("select")).toHaveTextContent(val),
    submit: () => userEvent.click(page.getByText("Submit")),
  };

  test("set value is displayed in button", async () => {
    await render(<TestForm />);
    await ui.setSelect();
    ui.expectValueToBe("Bar");
  });

  test("set value is used in submit handler", async () => {
    await render(<TestForm />);
    await ui.setSelect();
    await ui.submit();
    expect(handleSubmit).toHaveBeenCalledWith({
      select: "bar",
    });
  });
});

describe("Switch field", () => {
  interface FormValues {
    switchedField: boolean;
  }

  const TestForm = () => {
    const form = useForm<FormValues>({
      defaultValues: {
        switchedField: true,
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={(values) => handleSubmit(values)}>
        <Field name="switchedField">
          <Switch data-testid="switch" aria-label="test" />
        </Field>
        <Button type="submit">Submit</Button>
      </Form>
    );
  };

  test("switch uses default value", async () => {
    await render(<TestForm />);
    expect(page.getByTestId("switch")).toHaveAttribute("data-selected", "true");
  });
});

describe("Checkbox field", () => {
  interface FormValues {
    isActive: boolean;
  }

  const TestForm = () => {
    const form = useForm<FormValues>({
      defaultValues: {
        isActive: true,
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={(values) => handleSubmit(values)}>
        <Field name="isActive">
          <Checkbox data-testid="checkbox" aria-label="test" />
        </Field>
        <Button type="submit">Submit</Button>
      </Form>
    );
  };

  test("switch uses default value", async () => {
    await render(<TestForm />);

    expect(page.getByTestId("checkbox")).toHaveAttribute(
      "data-selected",
      "true",
    );
  });
});

describe("Text field", () => {
  interface Values {
    testDefaultValue: string;
    testUncontrolled: string;
    testControlled: string;
  }

  const TestForm = () => {
    const form = useForm<Values>({
      defaultValues: {
        testDefaultValue: "default-value",
      },
    });
    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={(values) => handleSubmit(values)}>
        <Field name="testUncontrolled">
          <TextField
            aria-label="testUncontrolled"
            onChange={(val) => {
              // setting form value will not effect inputs display value when uncontrolled
              form.setValue("testUncontrolled", val.toUpperCase());
            }}
          />
        </Field>
        <Field name="testControlled">
          <TextField
            aria-label="testControlled"
            onChange={(val) => {
              form.setValue("testControlled", val.toUpperCase());
            }}
            value={form.watch("testControlled")}
          />
        </Field>
        <Field name="testDefaultValue">
          <TextField aria-label="testDefaultValue" />
        </Field>
        <Button type="submit">Submit</Button>
      </Form>
    );
  };

  test("default value works", async () => {
    await render(<TestForm />);
    const field = page.getByLabelText("testDefaultValue");
    expect(field).toHaveDisplayValue("default-value");
  });

  test("updates its value (by ref), even if not controlled", async () => {
    await render(<TestForm />);
    const field = page.getByLabelText("testUncontrolled");
    await userEvent.type(field, "new name");
    expect(field).toHaveDisplayValue("NEW NAME");
  });

  test("can be used as controlled input", async () => {
    await render(<TestForm />);
    const field = page.getByLabelText("testControlled");
    await userEvent.type(field, "new name");
    expect(field).toHaveDisplayValue("NEW NAME");
  });

  test("shows validation error", async () => {
    const TestForm = () => {
      const form = useForm();
      const Field = typedField(form);
      return (
        <Form onSubmit={handleSubmit} form={form}>
          <Field name="test" rules={{ required: "Is required!" }}>
            <TextField aria-label="Test field" />
          </Field>
          <Button type="submit">Submit</Button>
        </Form>
      );
    };

    await render(<TestForm />);
    await userEvent.click(page.getByText("Submit"));

    expect(page.getByText("Is required!")).toBeInTheDocument();
    expect(page.getByLabelText("Test field")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});

describe("debounceValidate integration", () => {
  beforeEach(() => {
    vitest.resetAllMocks();
    vitest.useFakeTimers();
  });

  afterEach(() => {
    vitest.useRealTimers();
  });

  interface Values {
    username: string;
  }

  test("does not validate before debounce delay and then shows async error", async () => {
    const validate = vitest.fn(
      async (value: string): Promise<true | string> => {
        return value === "taken" ? "Username already taken" : true;
      },
    );

    const TestForm = () => {
      const form = useForm<Values>({
        defaultValues: {
          username: "",
        },
      });
      const Field = typedField(form);

      return (
        <Form form={form} onSubmit={(values) => handleSubmit(values)}>
          <Field
            name="username"
            rules={{
              validate: debounceValidate<Values, "username">(validate, 300),
            }}
          >
            <TextField aria-label="Username" />
          </Field>
          <Button type="submit">Submit</Button>
        </Form>
      );
    };

    await render(<TestForm />);

    const input = page.getByLabelText("Username");
    await userEvent.type(input, "taken");
    await userEvent.click(page.getByText("Submit"));

    await vitest.advanceTimersByTimeAsync(299);
    expect(validate).not.toHaveBeenCalled();
    await expect
      .element(page.getByText("Username already taken"))
      .not.toBeInTheDocument();

    await vitest.advanceTimersByTimeAsync(1);
    expect(validate).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenCalledWith("taken", expect.any(Object));

    expect(page.getByText("Username already taken")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test("submits when debounced async validation resolves true", async () => {
    const validate = vitest.fn(async (): Promise<true | string> => {
      return true;
    });

    const TestForm = () => {
      const form = useForm<Values>({
        defaultValues: {
          username: "",
        },
      });
      const Field = typedField(form);

      return (
        <Form form={form} onSubmit={(values) => handleSubmit(values)}>
          <Field
            name="username"
            rules={{
              validate: debounceValidate<Values, "username">(validate, 200),
            }}
          >
            <TextField aria-label="Username" />
          </Field>
          <Button type="submit">Submit</Button>
        </Form>
      );
    };

    await render(<TestForm />);

    const input = page.getByLabelText("Username");
    await userEvent.type(input, "available");
    await userEvent.click(page.getByText("Submit"));

    await vitest.advanceTimersByTimeAsync(200);

    expect(validate).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenCalledWith("available", expect.any(Object));
    expect(handleSubmit).toHaveBeenCalledWith({ username: "available" });
    await expect
      .element(page.getByText("Username already taken"))
      .not.toBeInTheDocument();
  });

  test("debounces rapid input and validates only latest value", async () => {
    const validate = vitest.fn(
      async (value: string): Promise<true | string> => {
        return value.length >= 3 ? true : "Too short";
      },
    );

    const TestForm = () => {
      const form = useForm<Values>({
        defaultValues: {
          username: "",
        },
        mode: "onChange",
      });
      const Field = typedField(form);

      return (
        <Form form={form} onSubmit={(values) => handleSubmit(values)}>
          <Field
            name="username"
            rules={{
              validate: debounceValidate<Values, "username">(validate, 250),
            }}
          >
            <TextField aria-label="Username" />
          </Field>
          <Button type="submit">Submit</Button>
        </Form>
      );
    };

    await render(<TestForm />);

    const input = page.getByLabelText("Username");

    await userEvent.type(input, "a");
    await vitest.advanceTimersByTimeAsync(100);

    await userEvent.type(input, "b");
    await vitest.advanceTimersByTimeAsync(100);

    await userEvent.type(input, "c");

    await vitest.advanceTimersByTimeAsync(250);

    expect(validate).toHaveBeenCalledTimes(1);
    expect(validate).toHaveBeenLastCalledWith("abc", expect.any(Object));

    await expect.element(page.getByText("Too short")).not.toBeInTheDocument();
  });
});
