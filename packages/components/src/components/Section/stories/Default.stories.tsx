import type { Meta, StoryObj } from "@storybook/react";
import Section from "../Section";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { Link } from "@/components/Link";
import { Switch } from "@/components/Switch";
import { StatusBadge } from "@/components/StatusBadge";
import Header from "@/components/Header";

const meta: Meta<typeof Section> = {
  title: "Structure/Section",
  component: Section,
  render: (props) => (
    <Section {...props}>
      <Heading>Newsletter</Heading>
      <Text>
        Upcoming releases, new features and tips about your hosting - we bring
        the most important information to inbox. Subscribe to our newsletter and
        stay up to date.
      </Text>
      <Link href="#">Subscribe</Link>
    </Section>
  ),
};
export default meta;

type Story = StoryObj<typeof Section>;

export const Default: Story = {};

export const MultipleSections: Story = {
  render: (props) => (
    <>
      <Section {...props}>
        <Heading>Personal Information</Heading>
        <TextField isRequired defaultValue="John">
          <Label>First name</Label>
        </TextField>
        <TextField isRequired defaultValue="Doe">
          <Label>Last name</Label>
        </TextField>
      </Section>
      <Section {...props}>
        <Heading>Newsletter</Heading>
        <Text>
          Upcoming releases, new features and tips about your hosting - we bring
          you the most important information in your inbox. Subscribe to our
          newsletter and stay up to date.
        </Text>
        <Link href="#">Subscribe</Link>
      </Section>
    </>
  ),
};

export const WithSwitch: Story = {
  render: (props) => (
    <Section {...props}>
      <Header>
        <Heading>Newsletter</Heading>
        <Switch>Subscription</Switch>
      </Header>
      <Text>
        Upcoming releases, new features and tips about your hosting - we bring
        the most important information to inbox. Subscribe to our newsletter and
        stay up to date.
      </Text>
    </Section>
  ),
};

export const WithStatusBadge: Story = {
  render: (props) => (
    <Section {...props}>
      <Header>
        <Heading>Newsletter</Heading>
        <StatusBadge>Subscribed</StatusBadge>
      </Header>

      <Text>
        Upcoming releases, new features and tips about your hosting - we bring
        the most important information to inbox. Subscribe to our newsletter and
        stay up to date.
      </Text>
    </Section>
  ),
};
