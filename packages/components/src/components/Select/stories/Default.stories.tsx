import type { Meta, StoryObj } from "@storybook/react";
import Select from "../index";
import React from "react";
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
  render: (props) => (
    <Select {...props}>
      <Label>App</Label>
      <Option>WordPress</Option>
      <Option>TYPO3</Option>
      <Option>Contao</Option>
      <Option>Drupal</Option>
      <Option>Joomla!</Option>
      <Option>Matomo</Option>
    </Select>
  ),
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const Required: Story = {
  args: { isRequired: true },
};

export const WithFieldDescription: Story = {
  render: (props) => (
    <Select {...props}>
      <Label>App</Label>
      <Option>WordPress</Option>
      <Option>TYPO3</Option>
      <Option>Contao</Option>
      <Option>Drupal</Option>
      <Option>Joomla!</Option>
      <Option>Matomo</Option>
      <FieldDescription>Select an app</FieldDescription>
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: (props) => (
    <Select {...props} defaultSelectedKey="WordPress">
      <Label>App</Label>
      <Option value="WordPress">WordPress</Option>
      <Option value="TYPO3">TYPO3</Option>
      <Option value="Contao">Contao</Option>
      <Option value="Drupal">Drupal</Option>
      <Option value="Joomla!">Joomla!</Option>
      <Option value="Matomo">Matomo</Option>
    </Select>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <Select {...props} isInvalid isRequired>
      <Label>App</Label>
      <Option>WordPress</Option>
      <Option>TYPO3</Option>
      <Option>Contao</Option>
      <Option>Drupal</Option>
      <Option>Joomla!</Option>
      <Option>Matomo</Option>
      <FieldError>Select an app to continue</FieldError>
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
        App
        <ContextualHelpTrigger>
          <Button />
          <ContextualHelp>
            <Text>{dummyText.short}</Text>
          </ContextualHelp>
        </ContextualHelpTrigger>
      </Label>
      <Option>WordPress</Option>
      <Option>TYPO3</Option>
      <Option>Contao</Option>
      <Option>Drupal</Option>
      <Option>Joomla!</Option>
      <Option>Matomo</Option>
    </Select>
  ),
};
