import type { Meta, StoryObj } from "@storybook/react";
import type { FC } from "react";
import React from "react";
import { Text } from "@/components/Text";
import { LabeledValue } from "@/components/LabeledValue";
import { Label } from "@/components/Label";
import { Section } from "@/components/Section";
import { FileController, FileTrigger } from "@/components/FileTrigger";
import { Button } from "@/components/Button";

const SelectedFiles: FC<{ files: File[] }> = (props) => (
  <LabeledValue>
    <Label>Selected files</Label>
    <Text>
      {props.files.length > 0 ? props.files.map((f) => f.name).join(", ") : "-"}
    </Text>
  </LabeledValue>
);

const meta: Meta<typeof FileTrigger> = {
  title: "Upload/FileTrigger",
  component: FileTrigger,
  parameters: {
    controls: { exclude: ["className", "controller"] },
  },
  render: (props) => {
    const controller = FileController.useNew();
    const files = controller.useFiles();

    return (
      <Section>
        <FileTrigger {...props} controller={controller}>
          <Button>Select file</Button>
        </FileTrigger>
        <SelectedFiles files={files} />
      </Section>
    );
  },
};
export default meta;

type Story = StoryObj<typeof FileTrigger>;

export const Default: Story = {};

export const AllowsMultiple: Story = {
  render: (props) => {
    const controller = FileController.useNew();
    const files = controller.useFiles();

    return (
      <Section>
        <FileTrigger {...props} controller={controller} allowsMultiple>
          <Button>Select multiple files</Button>
        </FileTrigger>
        <SelectedFiles files={files} />
      </Section>
    );
  },
};

export const AcceptedFileTypes: Story = {
  render: (props) => {
    const controller = FileController.useNew();
    const files = controller.useFiles();

    return (
      <Section>
        <FileTrigger
          {...props}
          controller={controller}
          allowsMultiple
          acceptedFileTypes={["image/png", "image/jpeg"]}
        >
          <Button>Select image</Button>
        </FileTrigger>
        <SelectedFiles files={files} />
      </Section>
    );
  },
};
