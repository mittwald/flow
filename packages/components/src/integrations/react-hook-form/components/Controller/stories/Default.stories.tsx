import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useForm } from "react-hook-form";
import { action } from "@storybook/addon-actions";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import {
  Controller,
  Form,
  typedController,
} from "@/integrations/react-hook-form";
import { Button } from "@/components/Button";
import { Section } from "@/components/Section";
import { ButtonGroup } from "@/components/ButtonGroup";
import { FieldDescription } from "@/components/FieldDescription";
import { NumberField } from "@/components/NumberField";
import { Radio, RadioGroup } from "@/components/RadioGroup";
import { Switch } from "@/components/Switch";
import { CheckboxGroup } from "@/components/CheckboxGroup";
import { Checkbox } from "@/components/Checkbox";

const submitAction = action("submit");

const meta: Meta<typeof Controller> = {
  title: "Integrations/React Hook Form/Controller",
  component: Controller,
  render: () => {
    interface Values {
      firstName: string;
      age: number;
      gender: string;
      testing: boolean;
      interests: string[];
    }

    const onSubmit = (values: Values): void => {
      submitAction(values);
    };

    const form = useForm<Values>({
      defaultValues: {
        firstName: "",
        gender: "",
      },
    });

    const TController = typedController(form);

    return (
      <Form onSubmit={form.handleSubmit(onSubmit)} form={form}>
        <Section>
          <TController
            name="firstName"
            rules={{
              required: true,
            }}
          >
            <TextField>
              <Label>First name</Label>
              <FieldDescription>The first part of your name</FieldDescription>
            </TextField>
          </TController>

          <TController name="age" rules={{ required: true, min: 18 }}>
            <NumberField>
              <Label>Age</Label>
            </NumberField>
          </TController>

          <TController name="gender" rules={{ required: true }}>
            <RadioGroup>
              <Label>Gender</Label>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="diverse">Diverse</Radio>
            </RadioGroup>
          </TController>

          <TController name="testing">
            <Switch>
              <Label>Activate testing</Label>
            </Switch>
          </TController>

          <TController
            name="interests"
            rules={{
              validate: {
                min: (val) =>
                  Array.isArray(val) && val.length > 0
                    ? true
                    : "Check at least 2 items",
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
          </TController>

          <ButtonGroup>
            <Button type="submit">Submit</Button>
          </ButtonGroup>
        </Section>
      </Form>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Controller>;

export const Default: Story = {};
