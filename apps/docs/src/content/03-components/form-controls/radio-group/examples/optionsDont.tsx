import {
  Label,
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components";

<div style={{ display: "flex", justifyContent: "center" }}>
  <RadioGroup defaultValue="0-10">
    <Label>Alter</Label>
    <Radio value="0-10">0-10 Jahre</Radio>
    <Radio value="10-20">11-20 Jahre</Radio>
    <Radio value="20-30">21-30 Jahre</Radio>
    <Radio value="30-40">31-40 Jahre</Radio>
    <Radio value="40+">40+ Jahre</Radio>
  </RadioGroup>
</div>;
