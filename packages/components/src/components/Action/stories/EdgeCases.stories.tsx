import type { Meta, StoryObj } from "@storybook/react";
import Action from "../Action";
import React from "react";
import defaultMeta from "./Default.stories";
import {
  asyncFunction,
  syncfunction,
  button,
} from "@/components/Button/stories/lib";

const meta: Meta<typeof Action> = {
  ...defaultMeta,
  title: "Actions/Action/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof Action>;

export const MixedAsyncSyncNested: Story = {
  args: {
    action: asyncFunction,
    children: (
      <Action action={asyncFunction}>
        <Action action={syncfunction}>
          <Action action={asyncFunction}>{button}</Action>
        </Action>
      </Action>
    ),
  },
};
