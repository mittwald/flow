import type { Meta, StoryObj } from "@storybook/react";
import Select from "../index";
import { Label } from "@/components/Label";
import FieldDescription from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { CountryOptions, sortByDachFirst } from "@/components/CountryOptions";
import { Option } from "@/components/Option";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { dummyText } from "@/lib/dev/dummyText";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";

const meta: Meta<typeof Select> = {
  title: "Form Controls/Select",
  component: Select,
  args: {
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
  render: (props) => (
    <Select {...props}>
      <Label>Starship</Label>
      <Option>Millennium Falcon</Option>
      <Option>X-Wing</Option>
      <Option>TIE Fighter</Option>
      <Option>Star Destroyer</Option>
      <Option>Y-Wing</Option>
      <Option>Slave I</Option>
    </Select>
  ),
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const WithFieldDescription: Story = {
  render: (props) => (
    <Select {...props}>
      <Label>Starship</Label>
      <Option>Millennium Falcon</Option>
      <Option>X-Wing</Option>
      <Option>TIE Fighter</Option>
      <Option>Star Destroyer</Option>
      <Option>Y-Wing</Option>
      <Option>Slave I</Option>
      <FieldDescription>Select a starship</FieldDescription>
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: (props) => (
    <Select {...props} defaultSelectedKey="Millennium Falcon">
      <Label>Starship</Label>
      <Option value="Millennium Falcon">Millennium Falcon</Option>
      <Option value="X-Wing">X-Wing</Option>
      <Option value="TIE Fighter">TIE Fighter</Option>
      <Option value="Star Destroyer">Star Destroyer</Option>
      <Option value="Y-Wing">Y-Wing</Option>
      <Option value="Slave I">Slave I</Option>
    </Select>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <Select {...props} isInvalid isRequired>
      <Label>Starship</Label>
      <Option>Millennium Falcon</Option>
      <Option>X-Wing</Option>
      <Option>TIE Fighter</Option>
      <Option>Star Destroyer</Option>
      <Option>Y-Wing</Option>
      <Option>Slave I</Option>
      <FieldError>Select a starship to continue</FieldError>
    </Select>
  ),
};

export const WithNumbers: Story = {
  render: (props) => (
    <Select {...props}>
      <Label>Number</Label>
      <Option value={1}>1</Option>
      <Option value={2}>2</Option>
      <Option value={3}>3</Option>
      <Option value={4}>4</Option>
    </Select>
  ),
};

export const WithCountryOptions: Story = {
  render: (props) => (
    <Select {...props}>
      <CountryOptions />
    </Select>
  ),
};

export const WithCountryOptionsAndCustomSort: Story = {
  render: (props) => (
    <Select {...props}>
      <CountryOptions sortBy={sortByDachFirst} />
    </Select>
  ),
};

export const WithContextualHelp: Story = {
  render: (props) => (
    <Select {...props}>
      <Label>
        Starship
        <ContextualHelpTrigger>
          <Button />
          <ContextualHelp>
            <Text>{dummyText.short}</Text>
          </ContextualHelp>
        </ContextualHelpTrigger>
      </Label>
      <Option>Millennium Falcon</Option>
      <Option>X-Wing</Option>
      <Option>TIE Fighter</Option>
      <Option>Star Destroyer</Option>
      <Option>Y-Wing</Option>
      <Option>Slave I</Option>
    </Select>
  ),
};
