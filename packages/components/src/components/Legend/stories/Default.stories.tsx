import type { Meta, StoryObj } from "@storybook/react";
import Legend from "../Legend";
import { LegendItem } from "../components/LegendItem";

const meta: Meta<typeof Legend> = {
  title: "Content/Legend",
  component: Legend,
  args: {},
  render: (props) => (
    <Legend {...props}>
      <LegendItem color="sea-green">Item 1</LegendItem>
      <LegendItem color="palatinate-blue">Item 2</LegendItem>
      <LegendItem color="tangerine">Item 3</LegendItem>
      <LegendItem color="magenta">Item 4</LegendItem>
      <LegendItem color="tropical-indigo">Item 5</LegendItem>
      <LegendItem color="malachite">Item 6</LegendItem>
      <LegendItem color="#555">Item 7</LegendItem>
    </Legend>
  ),
};
export default meta;

type Story = StoryObj<typeof Legend>;

export const Default: Story = {};
