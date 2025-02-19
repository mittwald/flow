import {
  Label,
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components";

<RadioGroup defaultValue="more">
  <Label>Täglicher Kaffeekonsum</Label>
  <Radio value="more">Mehr als 6 Tassen</Radio>
  <Radio value="5-6">5-6 Tassen</Radio>
  <Radio value="3-4">3-4 Tassen</Radio>
  <Radio value="1-2">1-2 Tassen</Radio>
  <Radio value="none">Trinke keinen Kaffee</Radio>
</RadioGroup>;
