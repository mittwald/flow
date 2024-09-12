import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useForm } from "react-hook-form";
import { action } from "@storybook/addon-actions";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { Field, Form, typedField } from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ActionGroup } from "@/components/ActionGroup";
import { FieldDescription } from "@/components/FieldDescription";
import { NumberField } from "@/components/NumberField";
import { Radio, RadioGroup } from "@/components/RadioGroup";
import { Switch } from "@/components/Switch";
import { CheckboxGroup } from "@/components/CheckboxGroup";
import { Checkbox } from "@/components/Checkbox";
import Select, { Option } from "@/components/Select";
import { Slider } from "@/components/Slider";
import { sleep } from "@/lib/promises/sleep";
import DatePicker from "@/components/DatePicker";
import { DateRangePicker } from "@/components/DateRangePicker";
import { getLocalTimeZone, today } from "@internationalized/date";

const submitAction = action("submit");

const meta: Meta<typeof Field> = {
  title: "Integrations/React Hook Form/Field",
  component: Field,
  render: () => {
    interface Values {
      firstName: string;
      lastName: string;
      age: number;
      gender: string;
      testing: boolean;
      interests: string[];
      storage: number;
      date: string;
      dateRange: string;
    }

    const handleOnSubmit = async (values: Values) => {
      await sleep(1500);
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        firstName: "",
        lastName: "",
        gender: "",
        storage: 200,
      },
    });

    const Field = typedField(form);

    return (
      <Form form={form} onSubmit={handleOnSubmit}>
        <Section>
          <Field
            name="firstName"
            rules={{
              required: "Please enter your name",
            }}
          >
            <TextField>
              <Label>First name</Label>
              <FieldDescription>The first part of your name</FieldDescription>
            </TextField>
          </Field>

          <Field
            name="lastName"
            rules={{
              required: "Please select your last name",
            }}
          >
            <Select>
              <Label>Last name</Label>
              <Option value="Simith">Smith</Option>
              <Option value="Williams">Williams</Option>
              <Option value="Peters">Peters</Option>
            </Select>
          </Field>

          <Field
            name="age"
            rules={{
              required: "Please enter your age",
              min: { value: 18, message: "You must be at least 18" },
            }}
          >
            <NumberField>
              <Label>Age</Label>
            </NumberField>
          </Field>

          <Field
            name="gender"
            rules={{ required: "Please choose your gender" }}
          >
            <RadioGroup>
              <Label>Gender</Label>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="diverse">Diverse</Radio>
            </RadioGroup>
          </Field>

          <Field name="testing">
            <Switch>
              <Label>Activate testing</Label>
            </Switch>
          </Field>

          <Field
            name="interests"
            rules={{
              validate: {
                min: (val) =>
                  Array.isArray(val) && val.length > 0
                    ? true
                    : "Check at least 1 item",
                max: (val) =>
                  Array.isArray(val) && val.length < 3
                    ? true
                    : "Check max 2 items",
              },
            }}
          >
            <CheckboxGroup>
              <Label>Interests</Label>
              <Checkbox value="foo">Foo</Checkbox>
              <Checkbox value="bar">Bar</Checkbox>
              <Checkbox value="baz">Baz</Checkbox>
            </CheckboxGroup>
          </Field>

          <Field name="storage">
            <Slider
              formatOptions={{
                style: "unit",
                unit: "gigabyte",
              }}
              minValue={20}
              maxValue={2000}
            >
              <Label>Storage</Label>
            </Slider>
          </Field>

          <Field name="date" rules={{ required: true }}>
            <DatePicker isRequired minValue={today(getLocalTimeZone())}>
              <Label>Future Date</Label>
            </DatePicker>
          </Field>

          <Field name="dateRange">
            <DateRangePicker>
              <Label>Date</Label>
            </DateRangePicker>
          </Field>

          <ActionGroup>
            <Button type="submit">Submit</Button>
          </ActionGroup>
        </Section>
      </Form>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {};
