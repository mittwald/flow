import {
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components/RadioGroup";
import { Label } from "@mittwald/flow-react-components/Label";

<RadioGroup
  variant="segmented"
  defaultValue="lastschrift"
  s={[1, 1]}
>
  <Label>Zahlungsart</Label>
  <Radio value="lastschrift">Lastschrift</Radio>
  <Radio value="Rechnung">Rechnung</Radio>
</RadioGroup>;
