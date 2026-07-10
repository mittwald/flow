import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { AlertIcon } from "@/components/AlertIcon";
import { HorizontalNavigation } from "@/components/HorizontalNavigation";
import { Link } from "@/components/Link";

const meta: Meta<typeof HorizontalNavigation> = {
  title: "Navigation/HorizontalNavigation",
  component: HorizontalNavigation,
  parameters: {
    controls: { exclude: ["className"] },
  },
  render: (props) => (
    <HorizontalNavigation aria-label="Project navigation" {...props}>
      <Link href="#">Apps</Link>
      <Link href="#" aria-current="page">
        Container
      </Link>
      <Link href="#">Domains</Link>
      <Link href="#">E-Mails</Link>
      <Link href="#">
        Databases
        <AlertIcon status="warning" />
      </Link>
      <Link href="#">Backups</Link>
    </HorizontalNavigation>
  ),
};

export default meta;

type Story = StoryObj<typeof HorizontalNavigation>;

export const Default: Story = {};
