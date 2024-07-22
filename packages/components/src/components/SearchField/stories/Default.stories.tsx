import type { Meta, StoryObj } from "@storybook/react";
import { SearchField } from "../index";
import React from "react";
import { action } from "@storybook/addon-actions";

const meta: Meta<typeof SearchField> = {
  title: "Form Controls/SearchField",
  component: SearchField,
  render: (props) => <SearchField onChange={action("onChange")} {...props} />,
};

export default meta;

type Story = StoryObj<typeof SearchField>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };
