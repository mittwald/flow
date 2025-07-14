import {
  CopyButton,
  Label,
  PasswordCreationField,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [password, setPassword] = useState("");

  return (
    <PasswordCreationField
      onChange={(password: string) => setPassword(password)}
    >
      <Label>Password</Label>
      <CopyButton text={password} />
    </PasswordCreationField>
  );
};
