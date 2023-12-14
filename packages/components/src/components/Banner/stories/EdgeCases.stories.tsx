import type { Meta, StoryObj } from "@storybook/react";
import Banner from "../Banner";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { dummyText } from "@/lib/dummyText";

const meta: Meta<typeof Banner> = {
  title: "Banner/Edge Cases",
  component: Banner,
};

export default meta;

type Story = StoryObj<typeof Banner>;

export const LongTexts: Story = {
  args: {
    children: (
      <>
        <Heading>{dummyText.medium}</Heading>
        <Content>{dummyText.long}</Content>
      </>
    ),
  },
};
