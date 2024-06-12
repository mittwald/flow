import type { Meta, StoryObj } from "@storybook/react";
import { PasswordField } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "@storybook/addon-actions";
import { IconPlus } from "@/components/Icon/components/icons";
import Button from "@/components/Button";
import { useForm } from "react-hook-form";
import { Controller, Form } from "@/integrations/react-hook-form";

const meta: Meta<typeof PasswordField> = {
  title: "Form Controls/PasswordField",
  component: PasswordField,
  render: (props) => (
    <PasswordField onChange={action("onChange")} {...props}>
      <Label>Password</Label>
      <Button slot="button" size="m" aria-label="Add to favorites">
        <IconPlus />
      </Button>
      <Button slot="button" size="m" aria-label="Add to favorites">
        <IconPlus />
      </Button>
      <Button slot="button" size="m" aria-label="Add to favorites">
        <IconPlus />
      </Button>
    </PasswordField>
  ),
};

export default meta;

type Story = StoryObj<typeof PasswordField>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const Required: Story = {
  args: { isRequired: true },
};

export const WithForm: Story = {
  render: (props) => {
    const form = useForm({
      defaultValues: {
        password: "asd",
      },
    });
    return (
      <Form
        onSubmit={() => {
          // do nothing
        }}
        form={form}
      >
        <Controller name={"password"} rules={{ required: true }}>
          <PasswordField>
            <Label>Password</Label>
          </PasswordField>
        </Controller>
      </Form>
    );
  },
};
