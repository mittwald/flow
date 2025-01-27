import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Label } from "@/components/Label";
import { Option } from "@/components/Option";
import FieldDescription from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { ComboBox } from "@/components/ComboBox";
import { Section } from "@/components/Section";
import { ColumnLayout } from "@/components/ColumnLayout";
import { TextField } from "@/components/TextField";
import { Select } from "@/components/Select";

const meta: Meta<typeof ComboBox> = {
  title: "Form Controls/ComboBox",
  component: ComboBox,
  render: (props) => (
    <ComboBox {...props}>
      <Label>Domain</Label>
      <Option>mydomain.de</Option>
      <Option>shop.mydomain.de</Option>
      <Option>anotherdomain.com</Option>
      <Option>www.anotherdomain.com</Option>
      <Option>anotherdomain.com/shop</Option>
      <Option>anotherdomain.com/blog</Option>
      <Option>onemoredomain.de</Option>
      <Option>www.onemoredomain.de</Option>
    </ComboBox>
  ),
};
export default meta;

type Story = StoryObj<typeof ComboBox>;

export const Default: Story = {};

export const Disabled: Story = { args: { isDisabled: true } };

export const Required: Story = {
  args: { isRequired: true },
};

export const WithFieldDescription: Story = {
  render: (props) => (
    <ComboBox {...props}>
      <Label>Domain</Label>
      <Option>mydomain.de</Option>
      <Option>shop.mydomain.de</Option>
      <Option>anotherdomain.com</Option>
      <Option>www.anotherdomain.com</Option>
      <Option>anotherdomain.com/shop</Option>
      <Option>anotherdomain.com/blog</Option>
      <Option>onemoredomain.de</Option>
      <Option>www.onemoredomain.de</Option>
      <FieldDescription>Select a domain</FieldDescription>
    </ComboBox>
  ),
};

export const WithDefaultValue: Story = {
  render: (props) => (
    <ComboBox {...props} defaultSelectedKey="mydomain.de">
      <Label>Domain</Label>
      <Option value="mydomain.de">mydomain.de</Option>
      <Option>shop.mydomain.de</Option>
      <Option>anotherdomain.com</Option>
      <Option>www.anotherdomain.com</Option>
      <Option>anotherdomain.com/shop</Option>
      <Option>anotherdomain.com/blog</Option>
      <Option>onemoredomain.de</Option>
      <Option>www.onemoredomain.de</Option>
    </ComboBox>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <ComboBox {...props} isInvalid isRequired>
      <Label>Domain</Label>
      <Option>mydomain.de</Option>
      <Option>shop.mydomain.de</Option>
      <Option>anotherdomain.com</Option>
      <Option>www.anotherdomain.com</Option>
      <Option>anotherdomain.com/shop</Option>
      <Option>anotherdomain.com/blog</Option>
      <Option>onemoredomain.de</Option>
      <Option>www.onemoredomain.de</Option>
      <FieldError>Select a domain to continue</FieldError>
    </ComboBox>
  ),
};

export const Emails: Story = {
  render: (props) => {
    const [value, setValue] = useState<string>();

    const domains = ["a.de", "b.de", "c.de"];

    const options = value?.includes("@")
      ? domains.map((d) => (
          <Option key={d} value={value?.split("@")[0] + "@" + d}>
            {value?.split("@")[0] + "@" + d}
          </Option>
        ))
      : null;

    console.log(options);

    return (
      <Section>
        <ComboBox {...props} isRequired onInputChange={(v) => setValue(v)}>
          <Label>Domain</Label>
          {options}
        </ComboBox>
        <ColumnLayout>
          <TextField>
            <Label>Name</Label>
          </TextField>
          <Select defaultSelectedKey="@a.de">
            <Label>Domain</Label>
            <Option value="@a.de">@a.de</Option>
            <Option value="@b.de">@b.de</Option>
            <Option value="@c.de">@c.de</Option>
          </Select>
        </ColumnLayout>
      </Section>
    );
  },
};

export const Files: Story = {
  render: (props) => {
    const files1 = ["home", "var"];
    const files2 = ["home/www", "home/backup", "home/etc"];
    const files3 = ["var/foo", "var/bar"];
    const [files, setFiles] = useState<string[]>(files1);

    const options = files.map((f) => (
      <Option key={f} value={f}>
        {f}
      </Option>
    ));

    return (
      <ComboBox
        {...props}
        isRequired
        onSelectionChange={(v) => {
          if (v === "home") {
            setFiles(files2);
          }
          if (v === "var") {
            setFiles(files3);
          }
        }}
      >
        <Label>Domain</Label>
        {options}
      </ComboBox>
    );
  },
};
