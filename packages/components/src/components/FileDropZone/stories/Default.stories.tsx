import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FileDropZone } from "@/components/FileDropZone";
import { Text } from "@/components/Text";
import { LabeledValue } from "@/components/LabeledValue";
import { Label } from "@/components/Label";
import { Section } from "@/components/Section";
import { useFileController } from "@/components/FileTrigger";

const meta: Meta<typeof FileDropZone> = {
  title: "Upload/FileDropZone",
  component: FileDropZone,
  parameters: {
    controls: { exclude: ["className", "controller"] },
  },
  render: (props) => {
    const controller = useFileController();
    const files = controller.useFiles();

    return (
      <Section>
        <FileDropZone {...props} controller={controller} />
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

export const AllowsMultiple: Story = { args: { allowsMultiple: true } };

export const AcceptedFileTypes: Story = {
  args: { acceptedFileTypes: ["image/png", "image/jpeg"] },
};
