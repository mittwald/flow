import {
  CopyButton,
  Label,
  PasswordCreationField,
} from "@mittwald/flow-react-components";
import React, { useState } from "react";

export default () => {
  const [password, setPassword] = useState<string>("");

  return (
    <PasswordCreationField onChange={(v) => setPassword(v)}>
      <Label>Password</Label>
      <CopyButton text={password} />
    </PasswordCreationField>
  );
};
