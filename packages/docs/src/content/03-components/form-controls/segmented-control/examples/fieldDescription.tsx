import {
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components/src/components/RadioGroup";
import { Label } from "@mittwald/flow-react-components/src/components/Label";
import { FieldDescription } from "@mittwald/flow-react-components/src/components/FieldDescription";

<RadioGroup variant="segmented" defaultValue="cloud">
  <Label>Speicherplatz</Label>
  <Radio value="cloud">Cloud</Radio>
  <Radio value="lokal">Lokal</Radio>
  <FieldDescription>
    Speicherplatz kann jederzeit geändert werden
  </FieldDescription>
</RadioGroup>;
