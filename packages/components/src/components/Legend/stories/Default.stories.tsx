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
      <LegendItem color="indigo">Rebel Alliance</LegendItem>
      <LegendItem color="amber">Galactic Empire</LegendItem>
      <LegendItem color="teal">Jedi Order</LegendItem>
      <LegendItem color="violet">The Mandalorians</LegendItem>
      <LegendItem color="berry">First Order</LegendItem>
      <LegendItem color="green">Bounty Hunters</LegendItem>
      <LegendItem color="#555">Other</LegendItem>
    </Legend>
  ),
};
export default meta;

type Story = StoryObj<typeof Legend>;

export const Default: Story = {};
