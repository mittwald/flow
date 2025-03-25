import type { Meta, StoryObj } from "@storybook/react";
import Legend from "../Legend";
import { LegendItem } from "../components/LegendItem";
import tokens from "@mittwald/flow-design-tokens/variables.json";

const meta: Meta<typeof Legend> = {
  title: "Content/Legend",
  component: Legend,
  args: {},
  render: (props) => (
    <Legend {...props}>
      <LegendItem
        color={tokens.color.categorical["sea-green"].value}
        title="Item 1"
      />
      <LegendItem
        color={tokens.color.categorical["palatinate-blue"].value}
        title="Item 2"
      />
      <LegendItem
        color={tokens.color.categorical["tangerine"].value}
        title="Item 3"
      />
      <LegendItem
        color={tokens.color.categorical["magenta"].value}
        title="Item 4"
      />
      <LegendItem
        color={tokens.color.categorical["tropical-indigo"].value}
        title="Item 5"
      />
      <LegendItem
        color={tokens.color.categorical["malachite"].value}
        title="Item 6"
      />
    </Legend>
  ),
};
export default meta;

type Story = StoryObj<typeof Legend>;

export const Default: Story = {};
