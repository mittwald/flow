import type { Meta, StoryObj } from "@storybook/react";
import Section from "../Section";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { Link } from "@/components/Link";

const meta: Meta<typeof Section> = {
  title: "Section",
  component: Section,
  render: (props) => (
    <Section {...props}>
      <Heading>Newsletter</Heading>
      <Text>
        Upcoming releases, new features and tips about your hosting - we bring
        the most important information to inbox. Subscribe to our newsletter and
        stay up to date.
      </Text>
      <Link>Subscribe</Link>
    </Section>
  ),
};
export default meta;

type Story = StoryObj<typeof Text>;

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
        <Link>Subscribe</Link>
      </Section>
    </>
  ),
};
