import React from "react";
import { Align } from "@/components/Align";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { Button } from "@/components/Button";
import type { Meta, StoryObj } from "@storybook/react";
import defaultMeta from "./Default.stories";
import { NumberField } from "@/components/NumberField";
import { TextArea } from "@/components/TextArea";
import { Select } from "@/components/Select";
import { Option } from "@/components/Option";
import { useForm } from "react-hook-form";
import { Form, SubmitButton } from "@/integrations/react-hook-form";
import { sleep } from "@/lib/promises/sleep";

const meta: Meta<typeof Align> = {
  ...defaultMeta,
  title: "Structure/Align/Input + Button",
  component: Align,
  render: (props) => (
    <Align {...props}>
      <TextField>
        <Label>Mail address</Label>
      </TextField>
      <Button>Hinzufügen</Button>
    </Align>
  ),
};
export default meta;

type Story = StoryObj<typeof Align>;

export const Default: Story = {};

export const WithNumberField: Story = {
  render: (props) => (
    <Align {...props}>
      <NumberField>
        <Label>Number</Label>
      </NumberField>
      <Button>Hinzufügen</Button>
    </Align>
  ),
};

export const WithTextArea: Story = {
  render: (props) => (
    <Align {...props}>
      <TextArea>
        <Label>Message</Label>
      </TextArea>
      <Button>Hinzufügen</Button>
    </Align>
  ),
};

export const WithSelect: Story = {
  render: (props) => (
    <Align {...props}>
      <Select>
        <Label>Options</Label>
        <Option>Option 1</Option>
        <Option>Option 2</Option>
      </Select>
      <Button>Hinzufügen</Button>
    </Align>
  ),
};

export const WithoutLabel: Story = {
  render: (props) => (
    <Align {...props}>
      <TextField />
      <Button>Hinzufügen</Button>
    </Align>
  ),
};

export const WithForm: Story = {
  render: (props) => {
    const form = useForm();
    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Align {...props}>
          <TextField>
            <Label>Mail address</Label>
          </TextField>
          <SubmitButton>Hinzufügen</SubmitButton>
        </Align>
      </Form>
    );
  },
};
