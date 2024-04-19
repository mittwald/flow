import type { Meta, StoryObj } from "@storybook/react";
import InlineAlert from "../InlineAlert";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import Button from "@/components/Button";
import { Skeleton } from "@/components/Skeleton";

const meta: Meta<typeof InlineAlert> = {
  title: "Status/InlineAlert",
  component: InlineAlert,
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger"],
    },
  },
  args: { status: "info" },
};

export default meta;

type Story = StoryObj<typeof InlineAlert>;

export const Default: Story = {
  render: (props) => (
    <InlineAlert {...props}>
      <Heading>Email address has been archived</Heading>
    </InlineAlert>
  ),
};

export const WithContent: Story = {
  render: (props) => (
    <InlineAlert {...props}>
      <Heading>Email address has been archived</Heading>
      <Content>
        As your domain has been deleted, this email address has been archived.
        To be able to send and receive emails, you must rename the address.
        <Button>Update email address</Button>
      </Content>
    </InlineAlert>
  ),
};

export const WithSkeletons: Story = {
  render: (props) => (
    <InlineAlert {...props}>
      <Heading>
        <Skeleton />
      </Heading>
      <Content>
        <Skeleton />
      </Content>
    </InlineAlert>
  ),
};
