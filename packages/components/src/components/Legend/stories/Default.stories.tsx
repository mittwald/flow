import type { Meta, StoryObj } from "@storybook/react";
import Legend from "../Legend";
import { LegendItem } from "../components/LegendItem";

const meta: Meta<typeof Legend> = {
  title: "Content/Legend",
  component: Legend,
  parameters: {
    controls: { disable: true },
  },
  render: (props) => (
    <Legend {...props}>
      <LegendItem color="sea-green">Rebel Alliance</LegendItem>
      <LegendItem color="palatinate-blue">Galactic Empire</LegendItem>
      <LegendItem color="tangerine">Jedi Order</LegendItem>
      <LegendItem color="magenta">The Mandalorians</LegendItem>
      <LegendItem color="tropical-indigo">First Order</LegendItem>
      <LegendItem color="malachite">Bounty Hunters</LegendItem>
      <LegendItem color="#555">Other</LegendItem>
    </Legend>
  ),
};
export default meta;

type Story = StoryObj<typeof Legend>;

export const Default: Story = {};
