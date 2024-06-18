import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Accordion } from "@/components/Accordion";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import Label from "@/components/Label";
import { Section } from "@/components/Section";
import { Link } from "@/components/Link";

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

export const WithLabel: Story = {
  render: (props) => (
    <Accordion {...props}>
      <Label>Label</Label>
      <Content>Accordion Content</Content>
    </Accordion>
  ),
};

export const WithAnchorLink: Story = {
  render: (props) => (
    <Section>
      <Accordion {...props} id="myAccordion">
        <Heading>Heading</Heading>
        <Content>Accordion Content</Content>
      </Accordion>
      <Link href="#myAccordion">Anchor link</Link>
    </Section>
  ),
};
