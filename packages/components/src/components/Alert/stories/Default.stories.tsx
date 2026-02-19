import type { Meta, StoryObj } from "@storybook/react";
import Alert from "../Alert";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Content } from "@/components/Content";
import Button from "@/components/Button";
import { ActionGroup } from "@/components/ActionGroup";
import { LayoutCard } from "@/components/LayoutCard";
import { Section } from "@/components/Section";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Alert> = {
  title: "Status/Alert",
  component: Alert,
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["info", "success", "warning", "danger"],
    },
  },
  args: { status: "info" },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: (props) => (
    <Alert {...props}>
      <Heading>Email address has been archived</Heading>
    </Alert>
  ),
};

export const WithContent: Story = {
  render: (props) => (
    <Alert {...props}>
      <Heading>Email address has been archived</Heading>
      <Content>
        As your domain has been deleted, this email address has been archived.
        To be able to send and receive emails, you must rename the address.
        <Button>Update email address</Button>
      </Content>
    </Alert>
  ),
};

export const WithActionGroup: Story = {
  render: (props) => (
    <Alert {...props}>
      <Heading>Email address has been archived</Heading>
      <Content>
        As your domain has been deleted, this email address has been archived.
        To be able to send and receive emails, you must rename the address.
        <ActionGroup>
          <Button>Update</Button>
          <Button variant="soft" color="secondary">
            Delete
          </Button>
        </ActionGroup>
      </Content>
    </Alert>
  ),
};

export const AboveSections: Story = {
  render: (props) => (
    <LayoutCard>
      <Alert {...props}>
        <Heading>Email address has been archived</Heading>
        <Content>
          As your domain has been deleted, this email address has been archived.
          To be able to send and receive emails, you must rename the address.
        </Content>
      </Alert>
      <Section>
        <Heading>Email address</Heading>
        <Text>{dummyText.long}</Text>
      </Section>
      <Section>
        <Heading>Spam protection</Heading>
        <Text>{dummyText.long}</Text>
      </Section>
    </LayoutCard>
  ),
  globals: {
    backgrounds: "light",
  },
};

export const States: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <Section>
      <Alert status="info">
        <Heading>Email address has been archived</Heading>
        <Content>
          As your domain has been deleted, this email address has been archived.
          To be able to send and receive emails, you must rename the address.
        </Content>
      </Alert>
      <Alert status="warning">
        <Heading>Storage is almost exceeded</Heading>
        <Content>
          Your storage space is over 80% utilized. We recommend that you upgrade
          the storage space to avoid disruptions during backups.
        </Content>
      </Alert>
      <Alert status="danger">
        <Heading>No SSL certificate could be issued</Heading>
        <Content>
          No SSL certificate could be issued for this domain because the domain
          IP does not point to your server IP.
        </Content>
      </Alert>
      <Alert status="success">
        <Heading>Your app is up to date</Heading>
        <Content>Your app has been updated to the current version.</Content>
      </Alert>
    </Section>
  ),
};
