import type { Meta, StoryObj } from "@storybook/react";
import Note from "../Note";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { Icon } from "@/components/Icon";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { Skeleton } from "@/components/Skeleton";

const meta: Meta<typeof Note> = {
  title: "Note",
  component: Note,
  argTypes: {
    variant: {
      control: "inline-radio",
    },
  },
  args: { variant: "info" },
};

export default meta;

type Story = StoryObj<typeof Note>;

export const Default: Story = {
  render: (props) => (
    <Note {...props}>
      <Heading>Email address has been archived</Heading>
    </Note>
  ),
};

export const WithContent: Story = {
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

export const WithCustomIcon: Story = {
  render: (props) => (
    <Note {...props}>
      <Icon faIcon={faEnvelope} />
      <Heading>Email address has been archived</Heading>
      <Content>
        As your domain has been deleted, this email address has been archived.
        To be able to send and receive emails, you must rename the address.
      </Content>
    </Note>
  ),
};

export const WithSkeletons: Story = {
  render: (props) => (
    <Note {...props}>
      <Icon>
        <Skeleton />
      </Icon>
      <Heading>
        <Skeleton />
      </Heading>
      <Content>
        <Skeleton />
      </Content>
    </Note>
  ),
};
