import { ColumnLayout } from "@mittwald/flow-react-components";
import { TextField } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";

<ColumnLayout s={[1, 1]}>
  <TextField isRequired>
    <Label>Vorname</Label>
  </TextField>
  <TextField isRequired>
    <Label>Nachname</Label>
  </TextField>
</ColumnLayout>;
