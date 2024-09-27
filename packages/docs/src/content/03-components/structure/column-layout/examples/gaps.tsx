import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";

<ColumnLayout m={[1, 1]} rowGap="s" columnGap="l">
  <TextField>
    <Label>Vorname</Label>
  </TextField>
  <TextField>
    <Label>Nachname</Label>
  </TextField>
  <ColumnLayout s={[2, 1]} columnGap="m">
    <TextField>
      <Label>Straße</Label>
    </TextField>
    <TextField>
      <Label>Hausnummer</Label>
    </TextField>
  </ColumnLayout>
  <TextField>
    <Label>Ort</Label>
  </TextField>
</ColumnLayout>;
