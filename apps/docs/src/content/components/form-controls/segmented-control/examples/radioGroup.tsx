import {
  FieldDescription,
  Label,
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components";

<RadioGroup defaultValue="lastschrift">
  <Label>Zahlungsart</Label>
  <Radio value="lastschrift">Lastschrift</Radio>
  <Radio value="rechnung">Rechnung</Radio>
  <FieldDescription>
    Die Zahlungsart kann jederzeit geändert werden
  </FieldDescription>
</RadioGroup>;
