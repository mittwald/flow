import type { Meta, StoryObj } from "@storybook/react";
import InlineAlert from "../InlineAlert";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { Skeleton } from "@/components/Skeleton";

const meta: Meta<typeof InlineAlert> = {
  title: "Status/Inline Alert",
  component: InlineAlert,
  argTypes: {
    variant: {
      control: "inline-radio",
    },
  },
  args: { variant: "info" },
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
      </Content>
    </InlineAlert>
  ),
};

export const WithSkeletons: Story = {
  render: (props) => (
    <InlineAlert {...props}>
      <Icon>
        <Skeleton />
      </Icon>
      <Heading>
        <Skeleton />
      </Heading>
      <Content>
        <Skeleton />
      </Content>
    </InlineAlert>
  ),
};
