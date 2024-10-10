import {
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components/RadioGroup";
import { Label } from "@mittwald/flow-react-components/Label";

<RadioGroup
  variant="segmented"
  defaultValue="entwickler"
  containerBreakpointSize="xs"
>
  <Label>Rolle</Label>
  <Radio value="entwickler">Entwickler</Radio>
  <Radio value="designer">Designer</Radio>
  <Radio value="geschäftsführer">Geschäftsführer</Radio>
  <Radio value="andere">Andere</Radio>
</RadioGroup>;
