import type { Meta, StoryObj } from "@storybook/react";
import { CopyButton } from "../CopyButton";

const meta: Meta<typeof CopyButton> = {
  title: "Actions/CopyButton",
  component: CopyButton,
  render: (props) => <CopyButton {...props} />,
  args: {
    text: "May the Force be with you.",
  },
  parameters: {
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {};
