import CheckboxButton from "@mittwald/flow-react-components/CheckboxButton";
import CheckboxGroup from "@mittwald/flow-react-components/CheckboxGroup";
import Label from "@mittwald/flow-react-components/Label";

<CheckboxGroup l={[1, 1]} m={[1]}>
  <Label>Berechtigungen</Label>
  <CheckboxButton value="read">Lesen</CheckboxButton>
  <CheckboxButton value="write">Schreiben</CheckboxButton>
</CheckboxGroup>;
