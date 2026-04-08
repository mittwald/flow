import type { Meta, StoryObj } from "@storybook/react";
import AlertIcon from "../AlertIcon";
import { statusTypes } from "@/lib/types/props";

const meta: Meta<typeof AlertIcon> = {
  title: "Status/AlertIcon",
  component: AlertIcon,
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["s", "m", "l"],
    },
    status: {
      control: "inline-radio",
      options: statusTypes,
    },
  },
  args: {
    size: "m",
    status: "info",
  },
};

export default meta;

type Story = StoryObj<typeof AlertIcon>;

export const Default: Story = {};
