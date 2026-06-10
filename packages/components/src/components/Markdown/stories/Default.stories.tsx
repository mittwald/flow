import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Markdown } from "@/components/Markdown";
import { StoryBackground } from "@/lib/dev/StoryBackground";
import { alphaColors } from "@/lib/types/props";

const meta: Meta<typeof Markdown> = {
  title: "Content/Markdown",
  component: Markdown,
  argTypes: {
    color: { control: "inline-radio", options: ["default", ...alphaColors] },
    headingOffset: { control: "inline-radio", options: [0, 1, 2, 3] },
  },
  args: { color: "default", headingOffset: 0 },
  parameters: {
    controls: { exclude: ["style", "ref", "components"] },
  },
  render: (props, context) => (
    <StoryBackground color={props.color} theme={context.globals.theme}>
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

export const CustomComponents: Story = {
  render: (props, context) => (
    <StoryBackground color={props.color} theme={context.globals.theme}>
      <Markdown
        {...props}
        components={{
          h2: ({ children }) => (
            <h2 style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {children}
            </h2>
          ),
        }}
      >
        {"# Heading 1\n" +
          "## Heading 2 overridden\n" +
          "This story uses custom renderers for `h2`\n" +
          "[Open docs](https://flowtide.dev)"}
      </Markdown>
    </StoryBackground>
  ),
};
