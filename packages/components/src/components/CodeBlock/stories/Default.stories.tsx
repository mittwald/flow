import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { Text } from "@/components/Text";
import { dummyText } from "@/lib/dev/dummyText";
import { Color } from "@/components/Color";

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
  globals: {
    backgrounds: "light",
  },
};

export const Light: Story = {
  args: {
    color: "light",
    copyable: true,
  },
  globals: {
    backgrounds: "dark",
  },
};

export const WithChildren: Story = {
  render: (props) => (
    <CodeBlock {...props}>
      <Text>{dummyText.short}</Text>
      <br />
      <Text>
        <Color color="lilac">{dummyText.short}</Color>
      </Text>
      <br />
      <Text>{dummyText.short}</Text>
      <br />
    </CodeBlock>
  ),
};
