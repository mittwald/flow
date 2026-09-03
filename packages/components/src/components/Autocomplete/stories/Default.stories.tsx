import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type { Chat } from "@/components/Chat";
import { Autocomplete } from "@/components/Autocomplete";
import { Label } from "@/components/Label";
import { SearchField } from "@/components/SearchField";
import Option from "@/components/Option";

const meta: Meta<typeof Chat> = {
  title: "Form Controls/Autocomplete",
  component: Autocomplete,
  parameters: {
    controls: { disable: true },
  },
  render: () => {
    const suggestEmail = (value: string) => {
      return ["rebellion.org", "empire.gov", "jedi.org", "hoth.net"].map(
        (d) => {
          const email = `${value.split("@")[0]}@${d}`;
          return (
            <Option key={email} value={email} textValue={email}>
              {email}
            </Option>
          );
        },
      );
    };

    const [input, setInput] = useState("");

    return (
      <Autocomplete>
        <SearchField onChange={setInput} value={input}>
          <Label>Comlink address</Label>
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
        <Label>Comlink address</Label>
      </SearchField>
      <Option value="rebellion.org">rebellion.org</Option>
      <Option value="empire.gov">empire.gov</Option>
      <Option value="jedi.org">jedi.org</Option>
    </Autocomplete>
  ),
};
