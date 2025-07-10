import type { Meta, StoryObj } from "@storybook/react";
import defaultMeta from "./Default.stories";
import { FileCard } from "@/components/FileCard";
import { dummyText } from "@/lib/dev/dummyText";
import { action } from "storybook/actions";

const meta: Meta<typeof FileCard> = {
  ...defaultMeta,
  title: "Upload/FileCard/Edge Cases",
  component: FileCard,
};
export default meta;

type Story = StoryObj<typeof FileCard>;

export const LongName: Story = {
  args: {
    name: dummyText.long,
    sizeInBytes: 47500,
    onDelete: () => {
      action("onDelete");
    },
  },
};

export const LongNameAndLink: Story = {
  args: {
    name: dummyText.long,
    sizeInBytes: 47500,
    onDelete: () => {
      action("onDelete");
    },
    href: "#",
  },
};
