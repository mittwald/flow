import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioButton, RadioGroup } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import { action } from "storybook/actions";
import { FieldError } from "@/components/FieldError";
import { Text } from "@/components/Text";
import { Content } from "@/components/Content";

const meta: Meta<typeof RadioGroup> = {
  title: "Form Controls/RadioGroup",
  component: RadioGroup,
  args: {
    onChange: action("onChange"),
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  render: (props) => (
    <RadioGroup {...props} defaultValue="admin">
      <Label>Role</Label>
      <Radio value="admin">Admin</Radio>
      <Radio value="member">Member</Radio>
      <Radio value="accountant">Accountant</Radio>
    </RadioGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {};

export const RadioGroupDisabled: Story = { args: { isDisabled: true } };

export const ReadOnly: Story = { args: { isReadOnly: true } };

export const RadioDisabled: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="admin">
      <Label>Role</Label>
      <Radio value="admin">Admin</Radio>
      <Radio value="member" isDisabled>
        Member
      </Radio>
      <Radio value="accountant">Accountant</Radio>
    </RadioGroup>
  ),
};

export const RadioButtons: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="admin">
      <Label>Role</Label>
      <RadioButton value="admin">Admin</RadioButton>
      <RadioButton value="member">Member</RadioButton>
      <RadioButton value="accountant">Accountant</RadioButton>
    </RadioGroup>
  ),
};

export const RadioButtonsReadOnly: Story = {
  args: { isReadOnly: true },
  render: (props) => (
    <RadioGroup {...props} defaultValue="admin">
      <Label>Role</Label>
      <RadioButton value="admin">Admin</RadioButton>
      <RadioButton value="member">Member</RadioButton>
      <RadioButton value="accountant">Accountant</RadioButton>
    </RadioGroup>
  ),
};

export const RadioButtonDisabled: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="admin">
      <Label>Role</Label>
      <RadioButton value="admin">Admin</RadioButton>
      <RadioButton value="member" isDisabled>
        Member
      </RadioButton>
      <RadioButton value="accountant">Accountant</RadioButton>
    </RadioGroup>
  ),
};

export const RadioButtonsWithContent: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="domain" aria-label="Domain">
      <RadioButton value="domain">
        <Text>Book domain</Text>
        <Content>
          Do you have a desired domain? No problem, we'll help you find the
          right domain for you.
        </Content>
      </RadioButton>
      <RadioButton value="virtualHost">
        <Text>Add virtual host</Text>
        <Content>
          The domain remains with your previous provider, but you can use it for
          your website in our mStudio.
        </Content>
      </RadioButton>
      <RadioButton value="subdomain">
        <Text>Add subdomain</Text>
        <Content>
          Create a subdomain from an existing domain to use for your project.
        </Content>
      </RadioButton>
    </RadioGroup>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <RadioGroup {...props} isInvalid isRequired>
      <Label>Role</Label>
      <Radio value="admin">Admin</Radio>
      <Radio value="member">Member</Radio>
      <Radio value="accountant">Accountant</Radio>
      <FieldError>Select a role to continue</FieldError>
    </RadioGroup>
  ),
};

export const ColumnLayout: Story = {
  render: (props) => (
    <RadioGroup m={[1, 1]} l={[1, 1, 1]} {...props} defaultValue="1">
      <Label>Options</Label>
      <Radio value="1">Option 1</Radio>
      <Radio value="2">Option 2</Radio>
      <Radio value="3">Option 3</Radio>
      <Radio value="4">Option 4</Radio>
      <Radio value="5">Option 5</Radio>
      <Radio value="6">Option 6</Radio>
    </RadioGroup>
  ),
};

export const RadioButtonsWithTextInContent: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="domain" aria-label="Domain">
      <RadioButton value="domain">
        <Text>2 vCPU</Text>
        <Content>
          <Text>4 GiB RAM</Text>
        </Content>
      </RadioButton>
    </RadioGroup>
  ),
};
