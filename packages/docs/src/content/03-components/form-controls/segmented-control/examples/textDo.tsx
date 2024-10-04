import {
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components/src/components/RadioGroup";
import { Label } from "@mittwald/flow-react-components/src/components/Label";

<RadioGroup variant="segmented" defaultValue="individuell">
  <Label>Einstellung</Label>
  <Radio value="standard">Standard</Radio>
  <Radio value="individuell">Individuell</Radio>
</RadioGroup>;
