import type { Meta, StoryObj } from "@storybook/react";
import { AlertText } from "@/components/AlertText";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof AlertText> = {
  title: "Status/AlertText",
  component: AlertText,
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger", "unavailable"],
    },
  },
  args: {
    status: "info",
  },
  render: (props) => <AlertText {...props}>{dummyText.short}</AlertText>,
};

export default meta;

type Story = StoryObj<typeof AlertText>;

export const Default: Story = {};
