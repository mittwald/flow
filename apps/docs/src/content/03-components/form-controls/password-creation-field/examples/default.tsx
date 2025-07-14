import {
  Label,
  PasswordCreationField,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const [password, setPassword] = useState("");

  return (
    <PasswordCreationField
      value={password}
      onChange={setPassword}
    >
      <Label>Password</Label>
    </PasswordCreationField>
  );
};
