import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "../index";
import { action } from "storybook/actions";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof Checkbox> = {
  title: "Form Controls/Checkbox",
  component: Checkbox,
  args: {
    onChange: action("onChange"),
    isDisabled: false,
    isReadOnly: false,
    isIndeterminate: false,
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  render: (props) => <Checkbox {...props}>Join the Rebel Alliance</Checkbox>,
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const WithFieldError: Story = {
  render: (props) => (
    <Checkbox {...props} isInvalid>
      Join the Rebel Alliance
      <FieldError>Please join to continue</FieldError>
    </Checkbox>
  ),
};
