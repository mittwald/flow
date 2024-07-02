import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FileDropZone } from "@/components/FileDropZone";
import FileController from "@/components/FileDropZone/FileController";
import { Text } from "@/components/Text";
import { LabeledValue } from "@/components/LabeledValue";
import { Label } from "@/components/Label";
import { Section } from "@/components/Section";

const meta: Meta<typeof FileDropZone> = {
  title: "Upload/FileDropZone",
  component: FileDropZone,
  render: (props) => {
    const fileController = FileController.useNew();
    const files = fileController.useFiles();

    return (
      <Section>
        <FileDropZone {...props} controller={fileController} />
        <LabeledValue>
          <Label>Selected files</Label>
          <Text>
            {files.length > 0 ? files.map((f) => f.name).join(", ") : "-"}
          </Text>
        </LabeledValue>
      </Section>
    );
  },
};
export default meta;

type Story = StoryObj<typeof FileDropZone>;

export const Default: Story = {};
