import type { Meta, StoryObj } from "@storybook/react";
import Alert from "../Alert";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Alert> = {
  ...defaultMeta,
  title: "Status/Alert/Status",
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  render: (props) => (
    <Alert {...props}>
      <Heading>Email address has been archived</Heading>
      <Content>
        As your domain has been deleted, this email address has been archived.
        To be able to send and receive emails, you must rename the address.
      </Content>
    </Alert>
  ),
};

export const Warning: Story = {
  args: { status: "warning" },
  render: (props) => (
    <Alert {...props}>
      <Heading>Storage is almost exceeded</Heading>
      <Content>
        Your storage space is over 80% utilized. We recommend that you upgrade
        the storage space to avoid disruptions during backups.
      </Content>
    </Alert>
  ),
};

export const Danger: Story = {
  args: { status: "danger" },
  render: (props) => (
    <Alert {...props}>
      <Heading>No SSL certificate could be issued</Heading>
      <Content>
        No SSL certificate could be issued for this domain because the domain IP
        does not point to your server IP.
      </Content>
    </Alert>
  ),
};

export const Success: Story = {
  args: { status: "success" },
  render: (props) => (
    <Alert {...props}>
      <Heading>Your app is up to date</Heading>
      <Content>Your app has been updated to the current version.</Content>
    </Alert>
  ),
};
