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

  return (
    <Autocomplete value={input} onChange={setInput}>
      <TextField>
        <Label>Email</Label>
      </TextField>
      <ContextMenu>{generateSuggestItems()}</ContextMenu>
    </Autocomplete>
  );
};
