import type { Meta, StoryObj } from "@storybook/react";
import Banner from "../Banner";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";

const meta: Meta<typeof Banner> = {
  title: "Banner/Variants",
  component: Banner,
};

export default meta;

type Story = StoryObj<typeof Banner>;

export const Info: Story = {
  args: {
    children: (
      <>
        <Heading>Email address has been archived</Heading>
        <Content>
          As your domain has been deleted, this email address has been archived.
          To be able to send and receive emails, you must rename the address.
        </Content>
      </>
    ),
  },
};

export const Warning: Story = {
  args: {
    severity: "warning",
    children: (
      <>
        <Heading>Storage is almost exceeded</Heading>
        <Content>
          Your storage space is over 80% utilized. We recommend that you upgrade
          the storage space to avoid disruptions during backups.
        </Content>
      </>
    ),
  },
};

export const Danger: Story = {
  args: {
    severity: "danger",
    children: (
      <>
        <Heading>No SSL certificate could be issued</Heading>
        <Content>
          No SSL certificate could be issued for this domain because the domain
          IP does not point to your server IP.
        </Content>
      </>
    ),
  },
};
