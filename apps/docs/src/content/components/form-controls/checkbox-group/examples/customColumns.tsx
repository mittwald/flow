import {
  CheckboxButton,
  CheckboxGroup,
  Label,
} from "@mittwald/flow-react-components";

<CheckboxGroup l={[1, 1]} m={[1]}>
  <Label>Berechtigungen</Label>
  <CheckboxButton value="read">Lesen</CheckboxButton>
  <CheckboxButton value="write">Schreiben</CheckboxButton>
</CheckboxGroup>;
