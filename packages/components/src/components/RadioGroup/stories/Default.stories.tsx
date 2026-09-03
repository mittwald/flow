import type { Meta, StoryObj } from "@storybook/react";
import { Radio, RadioButton, RadioGroup } from "../index";
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
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
  parameters: {
    controls: { exclude: ["onChange"] },
  },
  render: (props) => (
    <RadioGroup {...props} defaultValue="admin">
      <Label>Rank</Label>
      <Radio value="admin">Jedi Master</Radio>
      <Radio value="member">Jedi Knight</Radio>
      <Radio value="accountant">Padawan</Radio>
    </RadioGroup>
  ),
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {};

export const RadioDisabled: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="admin">
      <Label>Rank</Label>
      <Radio value="admin">Jedi Master</Radio>
      <Radio value="member" isDisabled>
        Jedi Knight
      </Radio>
      <Radio value="accountant">Padawan</Radio>
    </RadioGroup>
  ),
};

export const RadioButtons: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="admin">
      <Label>Rank</Label>
      <RadioButton value="admin">Jedi Master</RadioButton>
      <RadioButton value="member">Jedi Knight</RadioButton>
      <RadioButton value="accountant">Padawan</RadioButton>
    </RadioGroup>
  ),
};

export const RadioButtonDisabled: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="admin">
      <Label>Rank</Label>
      <RadioButton value="admin">Jedi Master</RadioButton>
      <RadioButton value="member" isDisabled>
        Jedi Knight
      </RadioButton>
      <RadioButton value="accountant">Padawan</RadioButton>
    </RadioGroup>
  ),
};

export const RadioButtonsWithContent: Story = {
  render: (props) => (
    <RadioGroup {...props} defaultValue="domain" aria-label="Transport">
      <RadioButton value="domain">
        <Text>Millennium Falcon</Text>
        <Content>
          The fastest hunk of junk in the galaxy - she'll make point five past
          lightspeed and get you clear of any Imperial patrol.
        </Content>
      </RadioButton>
      <RadioButton value="virtualHost">
        <Text>X-Wing Starfighter</Text>
        <Content>
          A nimble Rebel fighter with an astromech droid, perfect for precise
          strikes against the Empire.
        </Content>
      </RadioButton>
      <RadioButton value="subdomain">
        <Text>TIE Fighter</Text>
        <Content>
          <Text>
            An Imperial short-range fighter - fast and cheap, but fragile once
            the dogfight begins.
          </Text>
        </Content>
      </RadioButton>
    </RadioGroup>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <RadioGroup {...props} isInvalid isRequired>
      <Label>Rank</Label>
      <Radio value="admin">Jedi Master</Radio>
      <Radio value="member">Jedi Knight</Radio>
      <Radio value="accountant">Padawan</Radio>
      <FieldError>Select a rank to continue</FieldError>
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
