import {
  Button,
  Label,
  PasswordCreationField,
  IconSshKey,
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
      <Button>
        <IconSshKey />
      </Button>
    </PasswordCreationField>
  );
};
