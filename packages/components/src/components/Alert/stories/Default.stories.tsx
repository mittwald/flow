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
import { Link } from "@/components/Link";

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
      <Heading>{dummyText.short}</Heading>
    </Alert>
  ),
};

export const WithContent: Story = {
  render: (props) => (
    <Alert {...props}>
      <Heading>{dummyText.short}</Heading>
      <Content>
        {dummyText.medium}
        <Link>Link</Link>
        <ActionGroup>
          <Button>Primary</Button>
          <Button variant="soft" color="secondary">
            Secondary
          </Button>
        </ActionGroup>
        <Button>Button</Button>
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
