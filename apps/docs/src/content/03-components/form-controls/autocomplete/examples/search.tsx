import {
  ContextMenu,
  Label,
  MenuItem,
  Autocomplete,
  SearchField,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [input, setInput] = useState("");

  const generateSuggestItems = () => {
    return [
      "example.com",
      "test.org",
      "email.net",
      "mail.com",
    ].map((d) => {
      const email = `${input.split("@")[0]}@${d}`;
      return (
        <MenuItem key={email} id={email} textValue={email}>
          {email}
        </MenuItem>
      );
    });
  };

  return (
    <Autocomplete>
      <SearchField value={input} onChange={setInput}>
        <Label>Email</Label>
      </SearchField>
      <ContextMenu>{generateSuggestItems()}</ContextMenu>
    </Autocomplete>
  );
};
