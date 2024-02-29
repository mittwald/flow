import type { Meta, StoryObj } from "@storybook/react";
import InlineAlert from "../InlineAlert";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof InlineAlert> = {
  ...defaultMeta,
  title: "Status/InlineAlert/Variants",
};

export default meta;

type Story = StoryObj<typeof InlineAlert>;

export const Info: Story = {
  render: (props) => (
    <InlineAlert {...props}>
      <Heading>Email address has been archived</Heading>
      <Content>
        As your domain has been deleted, this email address has been archived.
        To be able to send and receive emails, you must rename the address.
      </Content>
    </InlineAlert>
  ),
};

export const Warning: Story = {
  args: { variant: "warning" },
  render: (props) => (
    <InlineAlert {...props}>
      <Heading>Storage is almost exceeded</Heading>
      <Content>
        Your storage space is over 80% utilized. We recommend that you upgrade
        the storage space to avoid disruptions during backups.
      </Content>
    </InlineAlert>
  ),
};

export const Danger: Story = {
  args: { variant: "danger" },
  render: (props) => (
    <InlineAlert {...props}>
      <Heading>No SSL certificate could be issued</Heading>
      <Content>
        No SSL certificate could be issued for this domain because the domain IP
        does not point to your server IP.
      </Content>
    </InlineAlert>
  ),
};

export const Success: Story = {
  args: { variant: "success" },
  render: (props) => (
    <InlineAlert {...props}>
      <Heading>Your app is up to date</Heading>
      <Content>Your app has been updated to the current version.</Content>
    </InlineAlert>
  ),
};
