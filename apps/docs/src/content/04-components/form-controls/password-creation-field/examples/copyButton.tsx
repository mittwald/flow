import {
  CopyButton,
  Label,
} from "@mittwald/flow-react-components";
import { PasswordCreationField } from "@mittwald/flow-react-components/mittwald-password-tools-js";

export default () => {
  return (
    <PasswordCreationField>
      <Label>Password</Label>
      <CopyButton />
    </PasswordCreationField>
  );
};
