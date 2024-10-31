import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";

<ColumnLayout rowGap="s" columnGap="l">
  <TextField isRequired>
    <Label>Vorname</Label>
  </TextField>
  <TextField isRequired>
    <Label>Nachname</Label>
  </TextField>
  <TextField isRequired>
    <Label>Straße</Label>
  </TextField>
  <TextField isRequired>
    <Label>Hausnummer</Label>
  </TextField>
</ColumnLayout>;
