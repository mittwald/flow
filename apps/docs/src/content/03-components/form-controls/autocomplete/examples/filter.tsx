import {
  ContextMenu,
  Label,
  TextField,
  MenuItem,
  Autocomplete,
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

  const domainDotComFilter = (
    textValue: string,
    ignored_inputValue: string,
  ) => {
    return textValue.includes(".com");
  };

  return (
    <Autocomplete
      value={input}
      onChange={setInput}
      filter={domainDotComFilter}
    >
      <TextField>
        <Label>Email</Label>
      </TextField>
      <ContextMenu>{generateSuggestItems()}</ContextMenu>
    </Autocomplete>
  );
};
