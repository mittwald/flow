import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "../index";
import React from "react";
import { dummyText } from "~/lib/dev/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Switch> = {
  ...defaultMeta,
  title: "Form Controls/Switch/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const LongText: Story = {
  render: (props) => (
    <Switch defaultSelected {...props}>
      {dummyText.long}
    </Switch>
  ),
};
