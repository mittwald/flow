import type { Meta, StoryObj } from "@storybook/react";
import Banner from "../Banner";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";

const meta: Meta<typeof Banner> = {
  title: "Banner/Variants",
  component: Banner,
  argTypes: {
    variant: {
      control: "inline-radio",
    },
  },
  args: { variant: "info" },
};

export default meta;

type Story = StoryObj<typeof Banner>;

export const Info: Story = {
  render: (props) => (
    <Banner {...props}>
      <Heading>Email address has been archived</Heading>
      <Content>
        As your domain has been deleted, this email address has been archived.
        To be able to send and receive emails, you must rename the address.
      </Content>
    </Banner>
  ),
};

// ToDo: variant als arg?
export const Warning: Story = {
  args: {
    variant: "warning",
  },
  render: (props) => (
    <Banner {...props}>
      <Heading>Storage is almost exceeded</Heading>
      <Content>
        Your storage space is over 80% utilized. We recommend that you upgrade
        the storage space to avoid disruptions during backups.
      </Content>
    </Banner>
  ),
};

export const Negative: Story = {
  args: {
    variant: "negative",
  },
  render: (props) => (
    <Banner {...props}>
      <Heading>No SSL certificate could be issued</Heading>
      <Content>
        No SSL certificate could be issued for this domain because the domain IP
        does not point to your server IP.
      </Content>
    </Banner>
  ),
};
