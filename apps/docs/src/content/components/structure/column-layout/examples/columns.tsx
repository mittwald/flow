import {
  ColumnLayout,
  Label,
  TextField,
} from "@mittwald/flow-react-components";

<ColumnLayout m={[2, 1]} l={[2, 1, 1]}>
  <TextField isRequired>
    <Label>Straße</Label>
  </TextField>
  <TextField isRequired>
    <Label>Hausnummer</Label>
  </TextField>
</ColumnLayout>;
