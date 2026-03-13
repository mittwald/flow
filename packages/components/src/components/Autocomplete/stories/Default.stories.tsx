import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import type { Chat } from "@/components/Chat";
import { Autocomplete } from "@/components/Autocomplete";
import { Label } from "@/components/Label";
import { SearchField } from "@/components/SearchField";
import Option from "@/components/Option";

const meta: Meta<typeof Chat> = {
  title: "Form Controls/Autocomplete",
  component: Autocomplete,
  parameters: {
    controls: { exclude: ["className"] },
  },
  render: () => {
    const suggestEmail = (value: string) => {
      return ["example.com", "test.org", "email.net", "mail.com"].map((d) => {
        const email = `${value.split("@")[0]}@${d}`;
        return (
          <Option key={email} value={email} textValue={email}>
            {email}
          </Option>
        );
      });
    };

    const [input, setInput] = useState("");

    return (
      <Autocomplete>
        <SearchField onChange={setInput} value={input}>
          <Label>Test</Label>
        </SearchField>
        {suggestEmail(input)}
      </Autocomplete>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Autocomplete>;

export const Default: Story = {};

export const FixedOptions: Story = {
  render: () => (
    <Autocomplete>
      <SearchField>
        <Label>Test</Label>
      </SearchField>
      <Option value="example.com">example.com</Option>
      <Option value="domain.de">domain.de</Option>
      <Option value="test.org">test.org</Option>
    </Autocomplete>
  ),
};
