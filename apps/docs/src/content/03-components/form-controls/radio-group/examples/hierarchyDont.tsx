import {
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";

<div style={{ display: "flex", justifyContent: "center" }}>
  <RadioGroup defaultValue="espelkamp">
    <Label>Wohnort</Label>
    <Radio value="espelkamp">Espelkamp</Radio>
    <Radio value="minden">Minden</Radio>
    <Radio value="rahden">Rahden</Radio>
    <Radio value="luebbecke">Lübbecke</Radio>
  </RadioGroup>
</div>;
