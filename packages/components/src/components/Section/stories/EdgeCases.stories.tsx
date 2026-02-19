import type { Meta, StoryObj } from "@storybook/react";
import Section from "../Section";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Switch } from "@/components/Switch";
import defaultStories from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { Field, Form, SubmitButton } from "@/integrations/react-hook-form";
import { action } from "storybook/actions";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { ActionGroup } from "@/components/ActionGroup";

const meta: Meta<typeof Section> = {
  ...defaultStories,
  title: "Structure/Section/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof Section>;

export const WithLongHeading: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: (props) => (
    <Section {...props}>
      <Header>
        <Heading>{dummyText.medium}</Heading>
        <Switch>Subscribed</Switch>
      </Header>
      <Text>
        Upcoming releases, new features and tips about your hosting - we bring
        the most important information to inbox. Subscribe to our newsletter and
        stay up to date.
      </Text>
    </Section>
  ),
};

export const WithForm: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: (props) => {
    const form = useForm();

    return (
      <Section {...props}>
        <Form form={form} onSubmit={() => action("submit")}>
          <Heading>Personal Information</Heading>
          <Field name="firstName">
            <TextField isRequired defaultValue="John">
              <Label>First name</Label>
            </TextField>
          </Field>
          <Field name="lastName">
            <TextField isRequired defaultValue="Doe">
              <Label>Last name</Label>
            </TextField>
          </Field>
          <ActionGroup>
            <SubmitButton color="accent">Submit</SubmitButton>
          </ActionGroup>
        </Form>
      </Section>
    );
  },
};
