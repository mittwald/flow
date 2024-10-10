import {
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components/RadioGroup";
import { Label } from "@mittwald/flow-react-components/Label";

<RadioGroup variant="segmented" defaultValue="ssh-key">
  <Label>Authentifizierungsart</Label>
  <Radio value="ssh-key">SSH-Key</Radio>
  <Radio value="passwort">Passwort</Radio>
</RadioGroup>;
