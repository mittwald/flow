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
};

export default meta;

type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  args: {
    children: <Heading>Email address has been archived</Heading>,
  },
};

export const WithContent: Story = {
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

export const WithCustomIcon: Story = {
  args: {
    children: (
      <>
        <Icon faIcon={faEnvelope} />
        <Heading>Email address has been archived</Heading>
        <Content>
          As your domain has been deleted, this email address has been archived.
          To be able to send and receive emails, you must rename the address.
        </Content>
      </>
    ),
  },
};
