import {
  CopyButton,
  Label,
} from "@mittwald/flow-react-components";
import { PasswordCreationField } from "@mittwald/flow-react-components/password-tools";

export default () => {
  return (
    <PasswordCreationField>
      <Label>Password</Label>
      <CopyButton />
    </PasswordCreationField>
  );
};
