import type { Meta, StoryObj } from "@storybook/react";
import Action from "../Action";
import React from "react";
import defaultMeta from "./Default.stories";
import {
  asyncAction,
  syncAction,
  trigger,
} from "@/components/Button/stories/lib";

const meta: Meta<typeof Action> = {
  ...defaultMeta,
  title: "Actions/Action/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof Action>;

export const MixedAsyncSyncNested: Story = {
  args: {
    action: asyncAction,
    children: (
      <Action action={asyncAction}>
        <Action action={syncAction}>
          <Action action={asyncAction}>{trigger}</Action>
        </Action>
      </Action>
    ),
  },
};
