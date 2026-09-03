import type { Meta, StoryObj } from "@storybook/react";
import { CheckboxGroup } from "../index";
import { Label } from "@/components/Label";
import { action } from "storybook/actions";
import { FieldError } from "@/components/FieldError";
import { Checkbox } from "@/components/Checkbox";
import { CheckboxButton } from "@/components/CheckboxButton";

const meta: Meta<typeof CheckboxGroup> = {
  title: "Form Controls/CheckboxGroup",
  component: CheckboxGroup,
  args: {
    onChange: action("onChange"),
    isDisabled: false,
    isReadOnly: false,
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  render: (props) => (
    <CheckboxGroup {...props}>
      <Label>Permissions</Label>
      <Checkbox value="read">Read</Checkbox>
      <Checkbox value="write">Write</Checkbox>
    </CheckboxGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {};

export const CheckboxDisabled: Story = {
  render: (props) => (
    <CheckboxGroup {...props}>
      <Label>Permissions</Label>
      <Checkbox value="read" isDisabled>
        Read
      </Checkbox>
      <Checkbox value="write">Write</Checkbox>
    </CheckboxGroup>
  ),
};

export const CheckboxButtons: Story = {
  render: (props) => (
    <CheckboxGroup {...props}>
      <Label>Permissions</Label>
      <CheckboxButton value="read">Read</CheckboxButton>
      <CheckboxButton value="write">Write</CheckboxButton>
    </CheckboxGroup>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <CheckboxGroup {...props} isInvalid isRequired>
      <Label>Permissions</Label>
      <Checkbox value="read">Read</Checkbox>
      <Checkbox value="write">Write</Checkbox>
      <FieldError>Select at least one to continue</FieldError>
    </CheckboxGroup>
  ),
};

export const ColumnLayout: Story = {
  render: (props) => (
    <CheckboxGroup l={[1, 1, 1]} m={[1, 1]} {...props}>
      <Label>Fleet</Label>
      <Checkbox value="1">X-Wing</Checkbox>
      <Checkbox value="2">TIE Fighter</Checkbox>
      <Checkbox value="3">Millennium Falcon</Checkbox>
      <Checkbox value="4">Star Destroyer</Checkbox>
      <Checkbox value="5">Y-Wing</Checkbox>
      <Checkbox value="6">A-Wing</Checkbox>
    </CheckboxGroup>
  ),
};
