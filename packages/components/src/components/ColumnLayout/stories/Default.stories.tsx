import type { Meta, StoryObj } from "@storybook/react";
import ColumnLayout from "../ColumnLayout";
import React from "react";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { InlineAlert } from "@/components/InlineAlert";
import { Heading } from "@/components/Heading";
import { Section } from "@/components/Section";

const meta: Meta<typeof ColumnLayout> = {
  title: "Structure/ColumnLayout",
  component: ColumnLayout,
  parameters: {
    controls: { exclude: ["s", "m", "l"] },
  },
  render: (props) => (
    <Section>
      <InlineAlert>
        <Heading>
          s: [1] (default), m: [1, 1] (default), l: [1, 1, 1] (default)
        </Heading>
      </InlineAlert>
      <ColumnLayout {...props}>
        <TextField>
          <Label>First name</Label>
        </TextField>
        <TextField>
          <Label>Last name</Label>
        </TextField>
        <TextField>
          <Label>Street</Label>
        </TextField>
        <TextField>
          <Label>House number</Label>
        </TextField>
      </ColumnLayout>
    </Section>
  ),
};
export default meta;

type Story = StoryObj<typeof ColumnLayout>;

export const Default: Story = {};

export const CustomValueS: Story = {
  render: (props) => (
    <Section>
      <InlineAlert>
        <Heading>
          s: [2, 1], m: [2, 1] (inherited), l: [2, 1] (inherited)
        </Heading>
      </InlineAlert>
      <ColumnLayout {...props} s={[2, 1]}>
        <TextField>
          <Label>Street</Label>
        </TextField>
        <TextField>
          <Label>House number</Label>
        </TextField>
      </ColumnLayout>
    </Section>
  ),
};

export const CustomValueL: Story = {
  render: (props) => (
    <Section>
      <InlineAlert>
        <Heading>s: [1] (default), m: [1, 1] (default), l: [1, 1, 4]</Heading>
      </InlineAlert>
      <ColumnLayout {...props} l={[1, 1, 4]}>
        <TextField>
          <Label>First name</Label>
        </TextField>
        <TextField>
          <Label>Last name</Label>
        </TextField>
      </ColumnLayout>
    </Section>
  ),
};

export const AllCustomValues: Story = {
  render: (props) => (
    <Section>
      <InlineAlert>
        <Heading>s: [2, 1], m: [3, 2, 1], l: [4, 3, 2, 1]</Heading>
      </InlineAlert>
      <ColumnLayout {...props} s={[2, 1]} m={[3, 2, 1]} l={[4, 3, 2, 1]}>
        <TextField>
          <Label>First name</Label>
        </TextField>
        <TextField>
          <Label>Last name</Label>
        </TextField>
        <TextField>
          <Label>Street</Label>
        </TextField>
        <TextField>
          <Label>House number</Label>
        </TextField>
      </ColumnLayout>
    </Section>
  ),
};
