import type { Meta, StoryObj } from "@storybook/react";
import type { FC } from "react";
import React from "react";
import { Text } from "@/components/Text";
import { LabeledValue } from "@/components/LabeledValue";
import { Label } from "@/components/Label";
import { Section } from "@/components/Section";
import { FileTrigger, useFileController } from "@/components/FileTrigger";
import { Button } from "@/components/Button";
import type FileController from "@/components/FileTrigger/FileController";

const SelectedFiles: FC<{ controller: FileController }> = (props) => {
  const files = props.controller.useFiles();

  return (
    <LabeledValue>
      <Label>Selected files</Label>
      <Text>
        {files.length > 0 ? files.map((f) => f.name).join(", ") : "-"}
      </Text>
    </LabeledValue>
  );
};

const meta: Meta<typeof FileTrigger> = {
  title: "Upload/FileTrigger",
  component: FileTrigger,
  parameters: {
    controls: { exclude: ["className", "controller"] },
  },
  render: (props) => {
    const controller = useFileController();

    return (
      <Section>
        <FileTrigger {...props} controller={controller}>
          <Button>Select file</Button>
        </FileTrigger>
        <SelectedFiles controller={controller} />
      </Section>
    );
  },
};
export default meta;

type Story = StoryObj<typeof FileTrigger>;

export const Default: Story = {};

export const AllowsMultiple: Story = {
  render: (props) => {
    const controller = useFileController();

    return (
      <Section>
        <FileTrigger {...props} controller={controller} allowsMultiple>
          <Button>Select multiple files</Button>
        </FileTrigger>
        <SelectedFiles controller={controller} />
      </Section>
    );
  },
};

export const AcceptedFileTypes: Story = {
  render: (props) => {
    const controller = useFileController();

    return (
      <Section>
        <FileTrigger
          {...props}
          controller={controller}
          acceptedFileTypes={["image/png", "image/jpeg"]}
        >
          <Button>Select image</Button>
        </FileTrigger>
        <SelectedFiles controller={controller} />
      </Section>
    );
  },
};
