import type { Meta, StoryObj } from "@storybook/react";
import IllustratedMessage from "../IllustratedMessage";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import {
  IconApp,
  IconDanger,
  IconInfo,
} from "@/components/Icon/components/icons";
import { ActionGroup } from "@/components/ActionGroup";
import { ProgressBar } from "@/components/ProgressBar";
import { Label } from "@/components/Label";
import { Section } from "@/components/Section";
import { Modal, ModalTrigger } from "@/components/Modal";
import { Content } from "@/components/Content";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof IllustratedMessage> = {
  title: "Content/Illustrated Message",
  component: IllustratedMessage,
  render: (props) => (
    <IllustratedMessage {...props}>
      <IconApp />
      <Heading>No apps installed</Heading>
      <Text>Create your first app to start working on your website.</Text>
      <Button>Create app</Button>
    </IllustratedMessage>
  ),
  argTypes: {
    color: {
      control: "inline-radio",
    },
  },
  args: { color: "primary" },
};
export default meta;

type Story = StoryObj<typeof IllustratedMessage>;

export const Default: Story = {};

export const Danger: Story = {
  render: (props) => (
    <IllustratedMessage {...props} color="danger">
      <IconDanger />
      <Heading>No access</Heading>
      <Text>You do not have the required permissions to access this page.</Text>
      <Button>Go back</Button>
    </IllustratedMessage>
  ),
};

export const Dark: Story = {
  args: { color: "dark" },
  globals: {
    backgrounds: "light",
  },
};

export const Light: Story = {
  args: { color: "light" },
  globals: {
    backgrounds: "dark",
  },
};

export const WithActionGroup: Story = {
  render: (props) => (
    <IllustratedMessage {...props}>
      <IconApp />
      <Heading>No apps installed</Heading>
      <Text>Create your first app to start working on your website.</Text>
      <ActionGroup>
        <Button variant="soft" color="secondary">
          Go back
        </Button>
        <Button>Create app</Button>
      </ActionGroup>
    </IllustratedMessage>
  ),
};

export const WithProgressBar: Story = {
  render: (props) => (
    <IllustratedMessage {...props}>
      <IconApp />
      <Heading>App is installing</Heading>
      <Text>This can take a couple of minutes.</Text>
      <ProgressBar
        value={500}
        maxValue={1000}
        minValue={0}
        formatOptions={{ style: "unit", unit: "gigabyte" }}
        {...props}
      >
        <Label>Storage</Label>
      </ProgressBar>
    </IllustratedMessage>
  ),
};

export const InSection: Story = {
  render: (props) => (
    <Section>
      <IllustratedMessage {...props}>
        <IconApp />
        <Heading>No apps installed</Heading>
        <Text>Create your first app to start working on your website.</Text>
      </IllustratedMessage>
    </Section>
  ),
};

export const InModal: Story = {
  render: (props) => (
    <ModalTrigger>
      <Button>Open modal</Button>
      <Modal>
        <Heading>Heading</Heading>
        <Content>
          <Section>
            <IllustratedMessage {...props}>
              <IconInfo />
              <Heading>{dummyText.short}</Heading>
              <Text>{dummyText.medium}</Text>
            </IllustratedMessage>
          </Section>
        </Content>
      </Modal>
    </ModalTrigger>
  ),
};
