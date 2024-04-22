import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Accordion } from "@/components/Accordion";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";

const meta: Meta<typeof Accordion> = {
  title: "Structure/Accordion",
  component: Accordion,
  render: (props) => (
    <Accordion {...props}>
      <Heading>Heading</Heading>
      <Content>Accordion Content</Content>
    </Accordion>
  ),
};
export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {};

export const DefaultExpanded: Story = {
  args: { defaultExpanded: true },
};
