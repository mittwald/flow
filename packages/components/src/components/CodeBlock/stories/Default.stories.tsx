import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CodeBlock } from "~/components/CodeBlock";
import {
  storyBackgroundDark,
  storyBackgroundLight,
} from "~/lib/dev/storyBackgrounds";

const meta: Meta<typeof CodeBlock> = {
  title: "Content/CodeBlock",
  component: CodeBlock,
  render: (props) => (
    <CodeBlock
      {...props}
      code={`{
    "projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",
    "name": "My Project"
}`}
    />
  ),
  args: {
    language: "json",
  },
};
export default meta;

type Story = StoryObj<typeof CodeBlock>;

export const Default: Story = {};

export const WithLineNumbers: Story = { args: { showLineNumbers: true } };

export const Copyable: Story = { args: { copyable: true } };

export const Dark: Story = {
  args: {
    color: "dark",
    copyable: true,
  },
  parameters: {
    backgrounds: storyBackgroundLight,
  },
};

export const Light: Story = {
  args: {
    color: "light",
    copyable: true,
  },
  parameters: {
    backgrounds: storyBackgroundDark,
  },
};
