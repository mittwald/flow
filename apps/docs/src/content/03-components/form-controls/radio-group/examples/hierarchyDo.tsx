import {
  Label,
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components";

<div style={{ display: "flex", justifyContent: "center" }}>
  <RadioGroup defaultValue="espelkamp">
    <Label>Wohnort</Label>
    <Radio value="espelkamp">Espelkamp</Radio>
    <Radio value="minden">Minden</Radio>
    <Radio value="rahden">Rahden</Radio>
    <Radio value="others">Andere</Radio>
  </RadioGroup>
</div>;
