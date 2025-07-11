import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { Chat } from "@/components/Chat";
import { Autocomplete } from "@/components/Autocomplete";
import { Label } from "@/components/Label";
import { SearchField } from "@/components/SearchField";
import { MenuItem } from "@/components/MenuItem";
import { ContextMenu } from "@/components/ContextMenu";

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
          <MenuItem key={email} id={email} textValue={email}>
            {email}
          </MenuItem>
        );
      });
    };

    const [input, setInput] = useState("");

    return (
      <Autocomplete>
        <SearchField onChange={setInput} value={input}>
          <Label>Test</Label>
        </SearchField>
        <ContextMenu>{suggestEmail(input)}</ContextMenu>
      </Autocomplete>
    );
  },
};
export default meta;

type Story = StoryObj<typeof Autocomplete>;

export const Default: Story = {};
