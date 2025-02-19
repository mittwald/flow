import { beforeEach, expect, vitest } from "vitest";
import { useForm } from "react-hook-form";
import { Form, typedField } from "@/integrations/react-hook-form";
import { Select } from "@/components/Select";
import { Option } from "@/components/Option";
import React from "react";
import { Button } from "@/components/Button";
import { Label } from "@/components/Label";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Switch } from "@/components/Switch";
import Checkbox from "@/components/Checkbox";

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
