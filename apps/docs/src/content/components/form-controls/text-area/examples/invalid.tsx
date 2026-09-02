import {
  FieldError,
  Label,
  TextArea,
} from "@mittwald/flow-react-components";

<TextArea isInvalid defaultValue="hello">
  <Label>Public Key</Label>
  <FieldError>Ungültiger Key</FieldError>
</TextArea>;
