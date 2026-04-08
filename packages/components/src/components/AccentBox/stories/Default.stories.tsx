import type { Meta, StoryObj } from "@storybook/react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Link } from "@/components/Link";
import { AccentBox } from "@/components/AccentBox";
import { dummyText } from "@/lib/dev/dummyText";
import { Section } from "@/components/Section";
import { LayoutCard } from "@/components/LayoutCard";
import { alphaColors } from "@/lib/types/props";
import { ColumnLayout } from "@/components/ColumnLayout";

const meta: Meta<typeof AccentBox> = {
  title: "Structure/AccentBox",
  component: AccentBox,
  render: (props) => (
    <AccentBox {...props}>
      <Section>
        <Heading>Heading</Heading>
        <Text>{dummyText.medium}</Text>
        <Link>Link</Link>
      </Section>
    </AccentBox>
  ),
  args: { color: "default", backgroundColor: "neutral" },
  argTypes: {
    color: { control: "inline-radio", options: ["default", ...alphaColors] },
    backgroundColor: {
      control: "inline-radio",
      options: [
        "neutral",
        "blue",
        "violet",
        "teal",
        "lilac",
        "green",
        "navy",
        "gradient",
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof AccentBox>;

export const Default: Story = {};

export const CustomColor: Story = {
  args: { backgroundColor: "#82368e", color: "light-static" },
};

export const BackgroundImage: Story = {
  args: {
    backgroundImage: dummyText.imageSrc,
    color: "light-static",
    aspectRatio: 1,
  },
  render: (props) => (
    <ColumnLayout>
      <AccentBox {...props}>
        <Section>
          <Heading>Heading</Heading>
          <Text>{dummyText.medium}</Text>
          <Link>Link</Link>
        </Section>
      </AccentBox>
    </ColumnLayout>
  ),
};

export const WithLink: Story = {
  render: (props) => (
    <Link>
      <AccentBox {...props}>
        <Section>
          <Heading>Heading</Heading>
          <Text>{dummyText.medium}</Text>
        </Section>
      </AccentBox>
    </Link>
  ),
};

export const InLayoutCard: Story = {
  render: (props) => (
    <LayoutCard>
      <AccentBox {...props}>
        <Section>
          <Heading>Heading</Heading>
          <Text>{dummyText.long}</Text>
          <Link>Link</Link>
        </Section>
      </AccentBox>
    </LayoutCard>
  ),
};

export const InLayoutCardWithLink: Story = {
  render: (props) => (
    <Link>
      <LayoutCard>
        <AccentBox {...props}>
          <Section>
            <Heading>Heading</Heading>
            <Text>{dummyText.long}</Text>
            <Link>Link</Link>
          </Section>
        </AccentBox>
      </LayoutCard>
    </Link>
  ),
};
