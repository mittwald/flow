import type { Meta, StoryObj } from "@storybook/react";
import Banner from "../Banner";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { Icon } from "@/components/Icon";
import { faStar } from "@fortawesome/free-regular-svg-icons/faStar";

const meta: Meta<typeof Banner> = {
  title: "Banner",
  component: Banner,
};

export default meta;

type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: {
    children: (
      <>
        <Icon faIcon={faStar} />
        <Heading level={3}>Heading...</Heading>
        <Content>Content...</Content>
      </>
    ),
  },
};
