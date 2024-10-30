import type { Meta, StoryObj } from "@storybook/react";
import defaultMeta from "./Default.stories";
import { FileCard } from "@/components/FileCard";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof FileCard> = {
  ...defaultMeta,
  title: "Upload/FileCard/Edge Cases",
  component: FileCard,
};
export default meta;

type Story = StoryObj<typeof FileCard>;

export const LongName: Story = {
  args: { name: dummyText.long, sizeInBytes: 47500 },
};
