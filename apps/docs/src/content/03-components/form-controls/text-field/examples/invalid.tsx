import { Label } from "@mittwald/flow-react-components";
import { TextField } from "@mittwald/flow-react-components";
import { FieldError } from "@mittwald/flow-react-components";

<TextField isInvalid defaultValue="hello">
  <Label>URL</Label>
  <FieldError>Das ist keine URL</FieldError>
</TextField>;
