import type { Meta, StoryObj } from "@storybook/react";
import { FileCardList } from "@/components/FileCardList";
import FileCard from "@/components/FileCard";

const meta: Meta<typeof FileCardList> = {
  title: "Upload/FileCardList",
  component: FileCardList,
  parameters: {
    controls: { disable: true },
  },
  render: (props) => (
    <FileCardList {...props}>
      <FileCard name="rebel-briefing.txt" />
      <FileCard name="mission-log.txt" />
      <FileCard name="hyperspace-route.txt" />
      <FileCard type="image/jpg" name="millennium-falcon.jpg" />
    </FileCardList>
  ),
};
export default meta;

type Story = StoryObj<typeof FileCardList>;

export const Default: Story = {};
