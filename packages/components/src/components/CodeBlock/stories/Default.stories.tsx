import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { dummyText } from "@/lib/dev/dummyText";
import { Color } from "@/components/Color";

const meta: Meta<typeof CodeBlock> = {
  title: "Content/CodeBlock",
  component: CodeBlock,
  parameters: {
    controls: { exclude: ["truncateLines"] },
  },
  args: {
    showLineNumbers: false,
    copyable: false,
    language: "json",
    code: `{
  "name": "My Project"
  "projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",
  "shortId": "p-123456",
  "createdAt": "2025-08-25T06:11:21.000Z",
  "enabled": true,
  "status": "ready",
  "serverId": "830d3c18-2d32-4768-b6a0-7e8b424a1271",
  "serverShortId": "s-123456",
}`,
  },
  argTypes: {
    showLineNumbers: { control: "boolean" },
  },
  render: (props) => <CodeBlock {...props} />,
};

export default meta;

type Story = StoryObj<typeof CodeBlock>;

export const Default: Story = {};

export const TruncateLines: Story = {
  args: { truncateLines: 4 },
};

export const WithChildren: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <CodeBlock>
      {dummyText.medium}
      <br />
      <Color color="danger">{dummyText.medium}</Color>
      <br />
      {dummyText.medium}
    </CodeBlock>
  ),
};
