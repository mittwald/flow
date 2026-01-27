import {
  ColumnLayout,
  Label,
  TextField,
} from "@mittwald/flow-react-components";

<ColumnLayout m={[1, 1]}>
  <TextField isRequired>
    <Label>Vorname</Label>
  </TextField>
  <TextField isRequired>
    <Label>Nachname</Label>
  </TextField>
  <ColumnLayout s={[2, 1]}>
    <TextField isRequired>
      <Label>Straße</Label>
    </TextField>
    <TextField isRequired>
      <Label>Hausnummer</Label>
    </TextField>
  </ColumnLayout>
  <ColumnLayout s={[2, 1]}>
    <TextField isRequired>
      <Label>Stadt</Label>
    </TextField>
    <TextField isRequired>
      <Label>PLZ</Label>
    </TextField>
  </ColumnLayout>
  <TextField isRequired>
    <Label>Land</Label>
  </TextField>
</ColumnLayout>;
