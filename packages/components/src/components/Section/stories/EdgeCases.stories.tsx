import type { Meta, StoryObj } from "@storybook/react";
import Section from "../Section";
import { Heading } from "@/components/Heading";
import defaultStories from "./Default.stories";
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

export const WithForm: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: (props) => {
    const form = useForm();

    return (
      <Section {...props}>
        <Form form={form} onSubmit={() => action("submit")}>
          <Heading>Rebel Personnel File</Heading>
          <Field name="firstName">
            <TextField isRequired defaultValue="Luke">
              <Label>First name</Label>
            </TextField>
          </Field>
          <Field name="lastName">
            <TextField isRequired defaultValue="Skywalker">
              <Label>Last name</Label>
            </TextField>
          </Field>
          <ActionGroup>
            <SubmitButton>Submit</SubmitButton>
          </ActionGroup>
        </Form>
      </Section>
    );
  },
};
