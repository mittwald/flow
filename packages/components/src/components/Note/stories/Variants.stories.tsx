import type { Meta, StoryObj } from "@storybook/react";
import Note from "../Note";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Note> = {
  ...defaultMeta,
  title: "Status/Note/Variants",
};

export default meta;

type Story = StoryObj<typeof Note>;

export const Info: Story = {
  render: (props) => (
    <Note {...props}>
      <Heading>Email address has been archived</Heading>
      <Content>
        As your domain has been deleted, this email address has been archived.
        To be able to send and receive emails, you must rename the address.
      </Content>
    </Note>
  ),
};

export const Warning: Story = {
  args: { variant: "warning" },
  render: (props) => (
    <Note {...props}>
      <Heading>Storage is almost exceeded</Heading>
      <Content>
        Your storage space is over 80% utilized. We recommend that you upgrade
        the storage space to avoid disruptions during backups.
      </Content>
    </Note>
  ),
};

export const Danger: Story = {
  args: { variant: "danger" },
  render: (props) => (
    <Note {...props}>
      <Heading>No SSL certificate could be issued</Heading>
      <Content>
        No SSL certificate could be issued for this domain because the domain IP
        does not point to your server IP.
      </Content>
    </Note>
  ),
};
