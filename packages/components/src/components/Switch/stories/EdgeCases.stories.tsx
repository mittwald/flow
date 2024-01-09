import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../index";
import React from "react";
import { action } from "@storybook/addon-actions";
import { dummyText } from "@/lib/dummyText";

const meta: Meta<typeof Switch> = {
  title: "Switch/Edge Cases",
  component: Switch,
  args: {
    onChange: action("onChange"),
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const LongText: Story = {
  render: (props) => (
    <Switch defaultSelected={true} {...props}>
      {dummyText.medium}
    </Switch>
  ),
};
