import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import type { Chat } from "@/components/Chat";
import { Autocomplete } from "@/components/Autocomplete";
import { Label } from "@/components/Label";
import { SearchField } from "@/components/SearchField";
import { MenuItem } from "@/components/MenuItem";
import { ContextMenu } from "@/components/ContextMenu";

function generateFromString(value: string) {
  return ["example.com", "test.org", "email.net", "mail.com"].map((d) => {
    const email = `${value}@${d}`;
    return (
      <MenuItem id={email} textValue={email}>
        {email}
      </MenuItem>
    );
  });
}

const meta: Meta<typeof Chat> = {
  title: "Autocomplete/Default",
  component: Autocomplete,
  parameters: {
    controls: { exclude: ["className"] },
  },
  render: () => {
    const [input, setInput] = useState("");

    return (
      <Autocomplete value={input} onChange={setInput}>
        <SearchField>
          <Label>Test</Label>
        </SearchField>
        <ContextMenu>{generateFromString(input)}</ContextMenu>
      </Autocomplete>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Autocomplete>;

export const Default: Story = {};
