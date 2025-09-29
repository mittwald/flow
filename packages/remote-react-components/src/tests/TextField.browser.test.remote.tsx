import { Div, Text, TextField } from "@/auto-generated";
import { useState } from "react";

export const standard = () => <TextField placeholder="field" />;

export const onPaste = () => {
  const [pastedText, setPastedText] = useState("");
  return (
    <Div>
      {pastedText && <Text data-testid="pasted-text">{pastedText}</Text>}
      <TextField placeholder="copy-me" value="FOO" />
      <TextField
        placeholder="field"
        onPaste={(event) => {
          setPastedText(event.clipboardData.getData("text"));
        }}
      />
    </Div>
  );
};
