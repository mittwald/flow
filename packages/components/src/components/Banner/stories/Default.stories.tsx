import type { Meta, StoryObj } from "@storybook/react";
import Banner from "../Banner";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { Icon } from "@/components/Icon";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

const meta: Meta<typeof Banner> = {
  title: "Banner",
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

export const Default: Story = {
  render: (props) => (
    <Banner {...props}>
      <Heading>Email address has been archived</Heading>
    </Banner>
  ),
};

export const WithContent: Story = {
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

export const WithCustomIcon: Story = {
  render: (props) => (
    <Banner {...props}>
      <Icon faIcon={faEnvelope} />
      <Heading>Email address has been archived</Heading>
      <Content>
        As your domain has been deleted, this email address has been archived.
        To be able to send and receive emails, you must rename the address.
      </Content>
    </Banner>
  ),
};
