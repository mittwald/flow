import {
  CopyButton,
  Label,
  PasswordCreationField,
} from "@mittwald/flow-react-components";

export default () => {
  return (
    <PasswordCreationField>
      <Label>Password</Label>
      <CopyButton />
    </PasswordCreationField>
  );
};
