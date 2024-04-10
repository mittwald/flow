import type { Meta, StoryObj } from "@storybook/react";
import Select, { Options, Option } from "../index";
import React from "react";
import { Label } from "@/components/Label";
import FieldDescription from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";

const meta: Meta<typeof Select> = {
  title: "Form Controls/Select",
  component: Select,
  render: (props) => (
    <Select {...props}>
      <Label>App</Label>
      <Options>
        <Option>WordPress</Option>
        <Option>TYPO3</Option>
        <Option>Contao</Option>
        <Option>Drupal</Option>
        <Option>Joomla!</Option>
        <Option>Matomo</Option>
      </Options>
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
      <Options>
        <Option>WordPress</Option>
        <Option>TYPO3</Option>
        <Option>Contao</Option>
        <Option>Drupal</Option>
        <Option>Joomla!</Option>
        <Option>Matomo</Option>
      </Options>
      <FieldDescription>Select an app</FieldDescription>
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: (props) => (
    <Select {...props} defaultSelectedKey="WordPress">
      <Label>App</Label>
      <Options>
        <Option id="WordPress">WordPress</Option>
        <Option id="TYPO3">TYPO3</Option>
        <Option id="Contao">Contao</Option>
        <Option id="Drupal">Drupal</Option>
        <Option id="Joomla!">Joomla!</Option>
        <Option id="Matomo">Matomo</Option>
      </Options>
    </Select>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <Select {...props} isInvalid isRequired>
      <Label>App</Label>
      <Options>
        <Option>WordPress</Option>
        <Option>TYPO3</Option>
        <Option>Contao</Option>
        <Option>Drupal</Option>
        <Option>Joomla!</Option>
        <Option>Matomo</Option>
      </Options>
      <FieldError>Select an app to continue</FieldError>
    </Select>
  ),
};
