import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Label } from "@/components/Label";
import { Option } from "@/components/Option";
import FieldDescription from "@/components/FieldDescription";
import { FieldError } from "@/components/FieldError";
import { ComboBox } from "@/components/ComboBox";
import { Section } from "@/components/Section";
import {
  ContextualHelp,
  ContextualHelpTrigger,
} from "@/components/ContextualHelp";
import { Button } from "@/components/Button";
import { Text } from "@/components/Text";
import { dummyText } from "@/lib/dev/dummyText";
import { CountryOptions } from "@/components/CountryOptions";

const meta: Meta<typeof ComboBox> = {
  title: "Form Controls/ComboBox",
  component: ComboBox,
  args: {
    isDisabled: false,
    isReadOnly: false,
    isRequired: false,
  },
  render: (props) => (
    <ComboBox {...props}>
      <Label>Domain</Label>
      <Option>rebelbase.org</Option>
      <Option>shop.rebelbase.org</Option>
      <Option>tatooine.com</Option>
      <Option>www.tatooine.com</Option>
      <Option>tatooine.com/shop</Option>
      <Option>tatooine.com/blog</Option>
      <Option>naboo.de</Option>
      <Option>www.naboo.de</Option>
    </ComboBox>
  ),
};
export default meta;

type Story = StoryObj<typeof ComboBox>;

export const Default: Story = {};

export const WithFieldDescription: Story = {
  render: (props) => (
    <ComboBox {...props}>
      <Label>Domain</Label>
      <Option>rebelbase.org</Option>
      <Option>shop.rebelbase.org</Option>
      <Option>tatooine.com</Option>
      <Option>www.tatooine.com</Option>
      <Option>tatooine.com/shop</Option>
      <Option>tatooine.com/blog</Option>
      <Option>naboo.de</Option>
      <Option>www.naboo.de</Option>
      <FieldDescription>Select a domain</FieldDescription>
    </ComboBox>
  ),
};

export const WithDefaultValue: Story = {
  render: (props) => (
    <ComboBox {...props} defaultSelectedKey="rebelbase.org">
      <Label>Domain</Label>
      <Option value="rebelbase.org">rebelbase.org</Option>
      <Option>shop.rebelbase.org</Option>
      <Option>tatooine.com</Option>
      <Option>www.tatooine.com</Option>
      <Option>tatooine.com/shop</Option>
      <Option>tatooine.com/blog</Option>
      <Option>naboo.de</Option>
      <Option>www.naboo.de</Option>
    </ComboBox>
  ),
};

export const WithFieldError: Story = {
  render: (props) => (
    <ComboBox {...props} isInvalid isRequired>
      <Label>Domain</Label>
      <Option>rebelbase.org</Option>
      <Option>shop.rebelbase.org</Option>
      <Option>tatooine.com</Option>
      <Option>www.tatooine.com</Option>
      <Option>tatooine.com/shop</Option>
      <Option>tatooine.com/blog</Option>
      <Option>naboo.de</Option>
      <Option>www.naboo.de</Option>
      <FieldError>Select a domain to continue</FieldError>
    </ComboBox>
  ),
};

export const Emails: Story = {
  render: (props) => {
    const [value, setValue] = useState<string>();

    const domains = ["hoth.org", "endor.org", "dagobah.org"];

    const options = value?.includes("@")
      ? domains.map((d) => (
          <Option key={d} value={value?.split("@")[0] + "@" + d}>
            {value?.split("@")[0] + "@" + d}
          </Option>
        ))
      : null;

    return (
      <Section>
        <ComboBox
          {...props}
          allowsEmptyCollection
          isRequired
          onInputChange={(v) => setValue(v)}
        >
          <Label>Email</Label>
          {options}
        </ComboBox>
      </Section>
    );
  },
};

export const WithPlaceholder: Story = {
  render: (props) => (
    <ComboBox {...props} placeholder="Select a domain" isRequired>
      <Label>Domain</Label>
      <Option>rebelbase.org</Option>
      <Option>shop.rebelbase.org</Option>
      <Option>tatooine.com</Option>
      <Option>www.tatooine.com</Option>
      <Option>tatooine.com/shop</Option>
      <Option>tatooine.com/blog</Option>
      <Option>naboo.de</Option>
      <Option>www.naboo.de</Option>
    </ComboBox>
  ),
};

export const WithContextualHelp: Story = {
  render: (props) => (
    <ComboBox {...props}>
      <Label>
        Domain
        <ContextualHelpTrigger>
          <Button />
          <ContextualHelp>
            <Text>{dummyText.short}</Text>
          </ContextualHelp>
        </ContextualHelpTrigger>
      </Label>
      <Option>rebelbase.org</Option>
      <Option>shop.rebelbase.org</Option>
      <Option>tatooine.com</Option>
      <Option>www.tatooine.com</Option>
      <Option>tatooine.com/shop</Option>
      <Option>tatooine.com/blog</Option>
      <Option>naboo.de</Option>
      <Option>www.naboo.de</Option>
    </ComboBox>
  ),
};

export const WithCountryOptions: Story = {
  render: (props) => (
    <ComboBox {...props}>
      <Label>Country</Label>
      <CountryOptions />
    </ComboBox>
  ),
};
