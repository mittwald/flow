import type { Meta, StoryObj } from "@storybook/react";
import AlertBadge from "../AlertBadge";
import React from "react";
import { Section } from "@/components/Section";

const meta: Meta<typeof AlertBadge> = {
  title: "Status/AlertBadge",
  component: AlertBadge,

  parameters: {
    controls: { exclude: ["className"] },
  },
  args: { status: "info" },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger"],
    },
  },
  render: (props) => <AlertBadge {...props}>AlertBadge</AlertBadge>,
};
export default meta;

type Story = StoryObj<typeof AlertBadge>;

export const Default: Story = {};

export const States: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <Section>
      <AlertBadge status="info">Info</AlertBadge>
      <AlertBadge status="warning">Warning</AlertBadge>
      <AlertBadge status="danger">Danger</AlertBadge>
      <AlertBadge status="success">Success</AlertBadge>
    </Section>
  ),
};
