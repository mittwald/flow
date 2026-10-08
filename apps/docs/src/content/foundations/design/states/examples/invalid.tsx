import {
  FieldError,
  Label,
  TextField,
} from "@mittwald/flow-react-components";

<TextField isInvalid defaultValue="mein-projekt">
  <Label>Domain</Label>
  <FieldError>Gib eine gültige Domain ein.</FieldError>
</TextField>;
