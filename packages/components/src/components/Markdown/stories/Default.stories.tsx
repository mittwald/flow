import type { Meta, StoryObj } from "@storybook/react";
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
          "The Death Star plans are hidden aboard the **Tantive IV** en route to `Tatooine`, guarded by the Rebel Alliance.\n" +
          "```json\n" +
          "{\n" +
          '    "projectId": "b3a96db5-ba8f-40dd-9100-bab43ac1f698",\n' +
          '    "name": "Rebel Base Yavin 4"\n' +
          "}\n" +
          "```\n" +
          "[link](#)\n" +
          "> May the Force be with you." +
          "\n - X-Wing squadron \n - Y-Wing squadron " +
          "\n 1. Approach the trench \n 2. Fire on the exhaust port\n\n" +
          "| Pilot          | Squadron      |\n" +
          "|---------------|---------------|\n" +
          "| Luke Skywalker | Red Five      |\n" +
          "| Wedge Antilles | Red Two       |\n"}
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
