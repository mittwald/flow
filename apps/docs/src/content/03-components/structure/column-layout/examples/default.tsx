import { ColumnLayout } from "@mittwald/flow-react-components";
import { TextField } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";

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
