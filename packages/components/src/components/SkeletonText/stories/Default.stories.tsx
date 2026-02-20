import type { Meta, StoryObj } from "@storybook/react";
import SkeletonText from "../SkeletonText";
import React from "react";
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Flex } from "@/components/Flex";

const meta: Meta<typeof SkeletonText> = {
  title: "Content/SkeletonText",
  component: SkeletonText,
  render: (props) => <SkeletonText {...props} />,
  parameters: {
    controls: { exclude: ["className", "width"] },
  },
};

export default meta;

type Story = StoryObj<typeof SkeletonText>;

export const Default: Story = {};

export const OnDarkBackground: Story = {
  globals: {
    backgrounds: "dark",
  },
};

export const CustomWidth: Story = {
  render: (props) => <SkeletonText {...props} width="200px" />,
};

export const WithSection: Story = {
  render: () => (
    <Flex direction="column">
      <Section>
        <Heading>
          <SkeletonText width={300} />
        </Heading>
        <Text>
          <SkeletonText />
        </Text>
        <Text>
          <SkeletonText />
          <SkeletonText />
        </Text>
      </Section>
    </Flex>
  ),
};
