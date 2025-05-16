import type { Meta, StoryObj } from "@storybook/react";
import ColumnLayout from "../ColumnLayout";
import React from "react";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { Alert } from "@/components/Alert";
import { Heading } from "@/components/Heading";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";
import { Image } from "@/components/Image";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof ColumnLayout> = {
  title: "Structure/ColumnLayout",
  component: ColumnLayout,
  parameters: {
    controls: { exclude: ["s", "m", "l", "className"] },
  },
  render: (props) => (
    <Section>
      <Alert>
        <Heading>
          s: [1] (default), m: [1, 1] (default), l: [1, 1, 1] (default)
        </Heading>
      </Alert>
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

export const CustomValueM: Story = {
  render: (props) => (
    <Section>
      <Alert>
        <Heading>s: [1] (default), m: [2, 1], l: [2, 1] (inherited)</Heading>
      </Alert>
      <ColumnLayout {...props} m={[2, 1]}>
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

export const AllCustomValues: Story = {
  render: (props) => (
    <Section>
      <Alert>
        <Heading>s: [2, 1], m: [3, 2, 1], l: [4, 3, 2, 1]</Heading>
      </Alert>
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
      </ColumnLayout>
    </Section>
  ),
};

export const Gaps: Story = {
  render: (props) => (
    <Section>
      <Alert>
        <Heading>Gap size: "s"</Heading>
      </Alert>
      <ColumnLayout {...props} gap="s">
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
      <Alert>
        <Heading>Gap size: "m"</Heading>
      </Alert>
      <ColumnLayout {...props} gap="m">
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
      <Alert>
        <Heading>Gap size: "l"</Heading>
      </Alert>
      <ColumnLayout {...props} gap="l">
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

export const Nested: Story = {
  render: (props) => (
    <ColumnLayout {...props} l={[1, 1]}>
      <TextField>
        <Label>First name</Label>
      </TextField>
      <TextField>
        <Label>Last name</Label>
      </TextField>
      <ColumnLayout>
        <TextField>
          <Label>Street</Label>
        </TextField>
        <TextField>
          <Label>House number</Label>
        </TextField>
      </ColumnLayout>
    </ColumnLayout>
  ),
};

export const HiddenColumns: Story = {
  render: (props) => (
    <ColumnLayout {...props} s={[1, null]} m={[2, 1]} l={[3, 1]}>
      <Text>{dummyText.long}</Text>
      <Image src={dummyText.imageSrc} alt="" />
    </ColumnLayout>
  ),
};
