import {
  FieldError,
  Label,
  TextField,
} from "@mittwald/flow-react-components";

<TextField isInvalid defaultValue="hello">
  <Label>URL</Label>
  <FieldError>Das ist keine URL</FieldError>
</TextField>;
