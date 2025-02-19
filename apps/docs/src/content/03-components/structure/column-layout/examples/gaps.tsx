import {
  ColumnLayout,
  Label,
  TextField,
} from "@mittwald/flow-react-components";

<ColumnLayout m={[1, 1]} rowGap="s" columnGap="l">
  <TextField isRequired>
    <Label>Vorname</Label>
  </TextField>
  <TextField isRequired>
    <Label>Nachname</Label>
  </TextField>
  <ColumnLayout s={[2, 1]} columnGap="m">
    <TextField isRequired>
      <Label>Straße</Label>
    </TextField>
    <TextField isRequired>
      <Label>Hausnummer</Label>
    </TextField>
  </ColumnLayout>
  <TextField isRequired>
    <Label>Ort</Label>
  </TextField>
</ColumnLayout>;
