import type { Meta, StoryObj } from "@storybook/react";
import ColumnLayout from "../ColumnLayout";
import React from "react";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { Text } from "@/components/Text";
import { dummyText } from "@/lib/dev/dummyText";
import { LayoutCard } from "@/components/LayoutCard";
import { InlineCode } from "@/components/InlineCode";

const meta: Meta<typeof ColumnLayout> = {
  title: "Structure/ColumnLayout",
  component: ColumnLayout,
  argTypes: {
    gap: { control: "inline-radio", options: ["s", "m", "l", "xl"] },
    columnGap: { control: "inline-radio", options: ["s", "m", "l", "xl"] },
    rowGap: { control: "inline-radio", options: ["s", "m", "l", "xl"] },
  },
  args: { gap: "m", columnGap: "m", rowGap: "m" },
  render: (props) => (
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
  ),
};
export default meta;

type Story = StoryObj<typeof ColumnLayout>;

export const Default: Story = {};

export const CustomValues: Story = {
  render: (props) => (
    <ColumnLayout {...props} m={[1, 1]} l={[1, 1]}>
      <TextField>
        <Label>First name</Label>
      </TextField>
      <TextField>
        <Label>Last name</Label>
      </TextField>
      <ColumnLayout s={[1, 1]}>
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
      <LayoutCard>
        <Text>{dummyText.medium}</Text>
      </LayoutCard>
      <LayoutCard>
        <Text>
          Hidden on size <InlineCode>s</InlineCode>
        </Text>
      </LayoutCard>
    </ColumnLayout>
  ),
  globals: {
    backgrounds: "light",
  },
};
