import {
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components/RadioGroup";
import { Label } from "@mittwald/flow-react-components/Label";

<RadioGroup variant="segmented" defaultValue="individuell">
  <Label>Wähle deine Einstellungsart aus:</Label>
  <Radio value="standard">Standard-Einstellungen</Radio>
  <Radio value="individuell">
    Individuell einstellbare Einstellungen
  </Radio>
</RadioGroup>;
