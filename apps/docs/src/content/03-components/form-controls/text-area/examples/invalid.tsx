import { Label } from "@mittwald/flow-react-components";
import { TextArea } from "@mittwald/flow-react-components";
import { FieldError } from "@mittwald/flow-react-components";

<TextArea isInvalid defaultValue="hello">
  <Label>Public Key</Label>
  <FieldError>Ungültiger Key</FieldError>
</TextArea>;
