import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";

<ColumnLayout m={[2, 1]}>
  <TextField isRequired>
    <Label>Straße</Label>
  </TextField>
  <TextField isRequired>
    <Label>Hausnummer</Label>
  </TextField>
</ColumnLayout>;
