import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxButton } from "../index";
import { action } from "storybook/actions";
import Content from "@/components/Content";
import Text from "@/components/Text";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof CheckboxButton> = {
  title: "Form Controls/CheckboxButton",
  component: CheckboxButton,
  args: {
    onChange: action("onChange"),
    isDisabled: false,
    isReadOnly: false,
    isIndeterminate: false,
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  render: (props) => (
    <CheckboxButton {...props}>Join the Rebel Alliance</CheckboxButton>
  ),
};

export default meta;

type Story = StoryObj<typeof CheckboxButton>;

export const Default: Story = {};

export const WithContent: Story = {
  render: (props) => (
    <CheckboxButton {...props}>
      <Text>Rebel Alliance</Text>
      <Content>Enlist with the Rebel Alliance and fight the Empire</Content>
    </CheckboxButton>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <CheckboxButton {...props} isInvalid>
      Join the Rebel Alliance
      <FieldError>Please join to continue</FieldError>
    </CheckboxButton>
  ),
};
