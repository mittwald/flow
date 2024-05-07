import Label from "@mittwald/flow-react-components/Label";
import TextField from "@mittwald/flow-react-components/TextField";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";

<ColumnLayout m={[1, 1]}>
  <TextField isRequired>
    <Label>URL</Label>
  </TextField>
  <TextField>
    <Label>URL</Label>
  </TextField>
</ColumnLayout>;
