import type { Meta, StoryObj } from "@storybook/react";
import Legend from "../Legend";
import { LegendItem } from "../components/LegendItem";

const meta: Meta<typeof Legend> = {
  title: "Content/Legend",
  component: Legend,
  args: {},
  render: (props) => (
    <Legend {...props}>
      <LegendItem color="sea-green" title="Item 1" />
      <LegendItem color="palatinate-blue" title="Item 2" />
      <LegendItem color="tangerine" title="Item 3" />
      <LegendItem color="magenta" title="Item 4" />
      <LegendItem color="tropical-indigo" title="Item 5" />
      <LegendItem color="malachite" title="Item 6" />
    </Legend>
  ),
};
export default meta;

type Story = StoryObj<typeof Legend>;

export const Default: Story = {};
