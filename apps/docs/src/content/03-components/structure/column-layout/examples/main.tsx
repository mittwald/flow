import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";

<ColumnLayout s={[1, 1]}>
  <TextField isRequired>
    <Label>Vorname</Label>
  </TextField>
  <TextField isRequired>
    <Label>Nachname</Label>
  </TextField>
</ColumnLayout>;
