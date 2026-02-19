import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Markdown } from "@/components/Markdown";

const meta: Meta<typeof Markdown> = {
  title: "Content/Markdown",
  component: Markdown,
  render: (props) => (
    <Markdown {...props}>
      {"# Heading 1\n" +
        "## Heading 2\n" +
        "Lorem ipsum dolor sit amet **consectetur adipisicing** elit. Cumque eius `quam quas vel voluptas` ullam aliquid fugit.\n" +
        "```json\n" +
        "{\n" +
        '    "projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",\n' +
        '    "name": "My Project"\n' +
        "}\n" +
        "```\n" +
        "[link](#)\n" +
        "> Block quote" +
        "\n - Unordered list item 1 \n - Unordered list item 2 " +
        "\n 1. Ordered list item 1 \n 2. Ordered list item 2\n\n" +
        "| Column 1       | Column 2      |\n" +
        "|---------------|---------------|\n" +
        "| Row 1 Cell 1  | Row 1 Cell 2  |\n" +
        "| Row 2 Cell 1  | Row 2 Cell 2  |\n"}
    </Markdown>
  ),
};
export default meta;

type Story = StoryObj<typeof Markdown>;

export const Default: Story = {};

export const Dark: Story = {
  args: {
    color: "dark",
  },

  globals: {
    backgrounds: "light",
  },
};

export const Light: Story = {
  args: {
    color: "light",
  },
  globals: {
    backgrounds: "dark",
  },
};

export const WithOffset: Story = {
  args: { headingOffset: 2 },
  render: (props) => (
    <Markdown {...props}>
      {"# Heading 1 -> 3\n" + "## Heading 2 -> 4\n" + "### Heading 3 -> 5"}
    </Markdown>
  ),
};
