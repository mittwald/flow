import { Combine } from "@/components/Combine";
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

const meta: Meta<typeof Combine> = {
  ...defaultMeta,
  title: "Structure/Combine/Input + Button",
  component: Combine,
  render: (props) => (
    <Combine {...props}>
      <TextField>
        <Label>Comlink address</Label>
      </TextField>
      <Button>Add</Button>
    </Combine>
  ),
};
export default meta;

type Story = StoryObj<typeof Combine>;

export const Default: Story = {};

export const WithNumberField: Story = {
  render: (props) => (
    <Combine {...props}>
      <NumberField>
        <Label>Number</Label>
      </NumberField>
      <Button>Add</Button>
    </Combine>
  ),
};

export const WithTextArea: Story = {
  render: (props) => (
    <Combine {...props}>
      <TextArea>
        <Label>Message</Label>
      </TextArea>
      <Button>Add</Button>
    </Combine>
  ),
};

export const WithSelect: Story = {
  render: (props) => (
    <Combine {...props}>
      <Select>
        <Label>Options</Label>
        <Option>Option 1</Option>
        <Option>Option 2</Option>
      </Select>
      <Button>Add</Button>
    </Combine>
  ),
};

export const WithoutLabel: Story = {
  render: (props) => (
    <Combine {...props}>
      <TextField aria-label="Label" />
      <Button>Add</Button>
    </Combine>
  ),
};

export const WithForm: Story = {
  render: (props) => {
    const form = useForm();
    return (
      <Form form={form} onSubmit={async () => await sleep(2000)}>
        <Combine {...props}>
          <TextField>
            <Label>Comlink address</Label>
          </TextField>
          <SubmitButton>Add</SubmitButton>
        </Combine>
      </Form>
    );
  },
};
