import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import defaultMeta from "./Default.stories";
import {
  asyncFunction,
  syncFunction,
  button,
} from "@/components/Button/stories/lib";
import { Action } from "@/components/Action";

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
        <Action action={syncFunction}>
          <Action action={asyncFunction}>{button}</Action>
        </Action>
      </Action>
    ),
  },
};
