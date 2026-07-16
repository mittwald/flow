import type { Meta, StoryObj } from "@storybook/react";
import EmulatedBoldText from "@/components/EmulatedBoldText";

const meta: Meta<typeof EmulatedBoldText> = {
  title: "Content/EmulatedBoldText",
  component: EmulatedBoldText,
  parameters: {
    controls: { disable: true },
  },
  render: (props) => (
    <EmulatedBoldText {...props}>Example Text</EmulatedBoldText>
  ),
};

export default meta;

type Story = StoryObj<typeof EmulatedBoldText>;

export const Default: Story = {};
