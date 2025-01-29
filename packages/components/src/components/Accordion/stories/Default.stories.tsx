import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Accordion } from "@/components/Accordion";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import Label from "@/components/Label";

const meta: Meta<typeof Accordion> = {
  title: "Structure/Accordion",
  component: Accordion,
  render: (props) => (
    <Accordion {...props}>
      <Heading>Heading</Heading>
      <Content>Accordion Content</Content>
    </Accordion>
  ),
  parameters: {
    controls: { exclude: ["defaultExpanded"] },
  },
};
export default meta;

type Story = StoryObj<typeof Accordion>;

export const Default: Story = {};

export const DefaultExpanded: Story = {
  args: { defaultExpanded: true },
};

export const OutlineVariant: Story = {
  args: { variant: "outline" },
};

export const WithLabel: Story = {
  render: (props) => (
    <Accordion {...props}>
      <Label>Label</Label>
      <Content>Accordion Content</Content>
    </Accordion>
  ),
};
