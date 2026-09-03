import type { Meta, StoryObj } from "@storybook/react";
import { SearchField } from "../index";
import { action } from "storybook/actions";
import { Label } from "@/components/Label";
import FieldDescription from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { Kbd } from "@/components/Kbd";

const meta: Meta<typeof SearchField> = {
  title: "Form Controls/SearchField",
  component: SearchField,
  args: { isDisabled: false, isReadOnly: false, isRequired: false },
  render: (props) => (
    <SearchField onChange={action("onChange")} {...props}>
      <Label>Search the Jedi Archives</Label>
    </SearchField>
  ),
};

export default meta;

type Story = StoryObj<typeof SearchField>;

export const Default: Story = {};

export const WithFieldDescription: Story = {
  render: (props) => (
    <SearchField {...props}>
      <Label>Search the Jedi Archives</Label>
      <FieldDescription>Press enter to search the archives</FieldDescription>
    </SearchField>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <SearchField {...props} defaultValue="Kamino" isInvalid>
      <Label>Search the Jedi Archives</Label>
      <FieldError>No records found in the archives</FieldError>
    </SearchField>
  ),
};

export const WithKbd: Story = {
  render: (props) => (
    <SearchField {...props}>
      <Kbd keys={["mod", "k"]} />
    </SearchField>
  ),
};
