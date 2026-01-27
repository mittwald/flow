import type { Meta, StoryObj } from "@storybook/react";
import defaultMeta from "./Default.stories";
import {
  asyncFunction,
  button,
  syncFunction,
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
    onAction: asyncFunction,
    children: (
      <Action onAction={asyncFunction}>
        <Action onAction={syncFunction}>
          <Action onAction={asyncFunction}>{button}</Action>
        </Action>
      </Action>
    ),
  },
};
