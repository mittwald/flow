import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Markdown } from "@/components/Markdown";
import { StoryBackground } from "@/lib/dev/StoryBackground";

const meta: Meta<typeof Markdown> = {
  title: "Content/Markdown",
  component: Markdown,
  argTypes: {
    color: { control: "inline-radio", options: ["default", "dark", "light"] },
    headingOffset: { control: "inline-radio", options: [0, 1, 2, 3] },
  },
  args: { color: "default", headingOffset: 0 },
  parameters: {
    controls: { exclude: ["style", "ref"] },
  },
  render: (props) => (
    <StoryBackground color={props.color}>
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
    </StoryBackground>
  ),
};
export default meta;

type Story = StoryObj<typeof Markdown>;

export const Default: Story = {};
