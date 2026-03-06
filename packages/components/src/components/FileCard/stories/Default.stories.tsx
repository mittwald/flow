import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FileCard } from "@/components/FileCard";
import { dummyText } from "@/lib/dev/dummyText";
import { action } from "storybook/actions";
import { ContextMenu } from "@/components/ContextMenu";
import MenuItem from "@/components/MenuItem";
import { Label } from "@/components/Label";
import { ProgressBar } from "@/components/ProgressBar";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button";
import {
  IconChevronDown,
  IconChevronUp,
} from "@/components/Icon/components/icons";

const meta: Meta<typeof FileCard> = {
  title: "Upload/FileCard",
  component: FileCard,
  args: { name: "image.jpg" },
  parameters: {
    controls: { exclude: ["href", "onDelete", "onPress", "imageSrc"] },
  },
  render: (props) => <FileCard {...props} />,
};
export default meta;

type Story = StoryObj<typeof FileCard>;

export const Default: Story = {};

export const WithType: Story = { args: { type: "image/png" } };

export const WithSize: Story = { args: { sizeInBytes: 47500 } };

export const WithActions: Story = {
  args: {
    href: "#",
    onDelete: () => {
      action("onDelete");
    },
  },
};

export const WithContextMenu: Story = {
  render: (props) => (
    <FileCard {...props}>
      <ContextMenu>
        <MenuItem>Löschen</MenuItem>
      </ContextMenu>
    </FileCard>
  ),
};
export const WithImage: Story = {
  args: {
    imageSrc: dummyText.imageSrc,
  },
};

export const WithProgressBar: Story = {
  args: {
    onDelete: () => {
      action("onDelete");
    },
    href: "#",
    name: undefined,
  },
  parameters: {
    controls: { exclude: ["href", "onDelete", "name"] },
  },
  render: (props) => (
    <FileCard {...props}>
      <ProgressBar
        value={2.1}
        maxValue={3.4}
        minValue={0}
        showMaxValue
        formatOptions={{ style: "unit", unit: "megabyte" }}
      >
        <Label>Image.png</Label>
      </ProgressBar>
    </FileCard>
  ),
};

export const Failed: Story = {
  render: (props) => (
    <FileCard isFailed {...props}>
      <Text>Upload failed</Text>
    </FileCard>
  ),
};

export const WithButtons: Story = {
  args: {
    onDelete: () => action("onDelete"),
    onPress: () => action("onPress"),
  },
  render: (props) => (
    <FileCard {...props}>
      <Button aria-label="Move up">
        <IconChevronUp />
      </Button>
      <Button aria-label="Move down">
        <IconChevronDown />
      </Button>
    </FileCard>
  ),
};
