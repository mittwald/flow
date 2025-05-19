import { Button } from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { Label } from "@/components/Label";
import { Option } from "@/components/Option";
import { Select } from "@/components/Select";
import { Switch } from "@/components/Switch";
import TextField from "@/components/TextField";
import { Form, typedField } from "@/integrations/react-hook-form";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { beforeEach, expect, vitest } from "vitest";

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

  test("set value is displayed in button", async () => {
    render(<TestForm />);
    await act(() => fireEvent.click(screen.getByText("Set select")));
    expect(screen.getByTestId("select")).toHaveTextContent("Bar");
  });

  test("set value is used in submit handler", async () => {
    render(<TestForm />);

    await act(() => fireEvent.click(screen.getByText("Set select")));
    await act(() => fireEvent.submit(screen.getByText("Submit")));

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
          <Switch data-testid="switch" />
        </Field>
        <Button type="submit">Submit</Button>
      </Form>
    );
  };

  test("switch uses default value", async () => {
    render(<TestForm />);

    expect(screen.getByTestId("switch").getAttribute("data-selected")).toBe(
      "true",
    );
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
          <Checkbox data-testid="checkbox" />
        </Field>
        <Button type="submit">Submit</Button>
      </Form>
    );
  };

  test("switch uses default value", async () => {
    render(<TestForm />);

    expect(screen.getByTestId("checkbox").getAttribute("data-selected")).toBe(
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
    render(<TestForm />);
    expect(screen.getByDisplayValue("default-value")).toBeInTheDocument();
  });

  test("updates its value (by ref) event if not controlled", async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    const field = screen.getByLabelText("testUncontrolled");
    await user.type(field, "new name");
    expect(screen.getByDisplayValue("NEW NAME")).toBeInTheDocument();
    expect(screen.getByDisplayValue("NEW NAME").hasAttribute("value")).toBe(
      false,
    );
  });

  test("can be used as controlled input", async () => {
    const user = userEvent.setup();
    render(<TestForm />);
    const field = screen.getByLabelText("testControlled");
    await user.type(field, "new name");
    expect(screen.getByDisplayValue("NEW NAME")).toBeInTheDocument();
    expect(screen.getByDisplayValue("NEW NAME").getAttribute("value")).toBe(
      "NEW NAME",
    );
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

    render(<TestForm />);
    await act(() => fireEvent.submit(screen.getByText("Submit")));

    screen.getByText("Is required!");
    expect(screen.getByLabelText("Test field")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
