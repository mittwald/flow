import {
  Label,
  Autocomplete,
  SearchField,
  Option,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [input, setInput] = useState("");

  const components = [
    "Button",
    "Checkbox",
    "ContextMenu",
    "Modal",
    "Select",
    "TextField",
  ];

  const suggestItems = components
    .filter((name) =>
      name.toLowerCase().includes(input.toLowerCase()),
    )
    .map((name) => (
      <Option key={name} value={name} textValue={name}>
        {name}
      </Option>
    ))
    .filter(() => input);

  return (
    <Autocomplete>
      <SearchField value={input} onChange={setInput}>
        <Label>Komponente</Label>
      </SearchField>
      {suggestItems}
    </Autocomplete>
  );
};
