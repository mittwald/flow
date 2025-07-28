import {
  Option,
  Label,
  TextField,
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
        <Option key={email} value={email} textValue={email}>
          {email}
        </Option>
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
    <Autocomplete filter={domainDotComFilter}>
      <TextField value={input} onChange={setInput}>
        <Label>Email</Label>
      </TextField>
      {generateSuggestItems()}
    </Autocomplete>
  );
};
