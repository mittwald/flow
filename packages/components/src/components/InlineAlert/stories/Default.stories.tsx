import type { Meta, StoryObj } from "@storybook/react";
import { InlineAlert } from "@/components/InlineAlert/InlineAlert";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof InlineAlert> = {
  title: "Status/InlineAlert",
  component: InlineAlert,
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger", "unavailable"],
    },
  },
  args: {
    status: "info",
    children: dummyText.short,
  },
};

export default meta;

type Story = StoryObj<typeof InlineAlert>;

export const Info: Story = {
  args: { status: "info" },
};

export const Success: Story = {
  args: { status: "success" },
};

export const Warning: Story = {
  args: { status: "warning" },
};

export const Danger: Story = {
  args: { status: "danger" },
};

export const Unavailable: Story = {
  args: { status: "unavailable" },
};
