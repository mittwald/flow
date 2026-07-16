import type { Meta, StoryObj } from "@storybook/react";
import { Text } from "@/components/Text";
import { Color } from "@/components/Color";
import Heading from "@/components/Heading";
import { Section } from "@/components/Section";
import { statusTypes } from "@/lib/types/props";

const meta: Meta<typeof Color> = {
  title: "Content/Color",
  component: Color,
  args: { color: "blue" },
  argTypes: {
    color: {
      control: "inline-radio",
      options: ["blue", "violet", "teal", "lilac", ...statusTypes],
    },
  },
  render: (props) => (
    <Section>
      <Heading>
        The <Color {...props}>Force</Color> flows through all things
      </Heading>
      <Text>
        In my experience, <Color {...props}>there is no such thing</Color> as
        luck — only the Force.
      </Text>
    </Section>
  ),
};
export default meta;

type Story = StoryObj<typeof Color>;

export const Default: Story = {};

export const Custom: Story = {
  args: { color: "#0fdf00" },
  argTypes: {
    color: {
      control: "text",
    },
  },
};
