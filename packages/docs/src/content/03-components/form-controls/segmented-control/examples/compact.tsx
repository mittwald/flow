import {
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components/src/components/RadioGroup";
import { Label } from "@mittwald/flow-react-components/src/components/Label";

<RadioGroup
  variant="segmented"
  defaultValue="dev"
  containerBreakpointSize="xs"
>
  <Label>Rolle</Label>
  <Radio value="entwickler">Entwickler</Radio>
  <Radio value="designer">Designer</Radio>
  <Radio value="geschäftsführer">Geschäftsführer</Radio>
  <Radio value="andere">Andere</Radio>
</RadioGroup>;
