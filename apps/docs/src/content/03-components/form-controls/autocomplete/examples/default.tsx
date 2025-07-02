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

  const suggestEmail = (value: string) => {
    return [
      "example.com",
      "test.org",
      "email.net",
      "mail.com",
    ].map((d) => {
      const email = `${value.split("@")[0]}@${d}`;
      return (
        <MenuItem id={email} textValue={email}>
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
      <ContextMenu>{suggestEmail(input)}</ContextMenu>
    </Autocomplete>
  );
};
