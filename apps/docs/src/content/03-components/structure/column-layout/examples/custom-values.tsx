import { ColumnLayout } from "@mittwald/flow-react-components";
import { TextField } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";

<ColumnLayout m={[2, 1]}>
  <TextField isRequired>
    <Label>Straße</Label>
  </TextField>
  <TextField isRequired>
    <Label>Hausnummer</Label>
  </TextField>
</ColumnLayout>;
