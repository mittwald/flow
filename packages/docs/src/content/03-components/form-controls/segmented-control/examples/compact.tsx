import {
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components/RadioGroup";
import { Label } from "@mittwald/flow-react-components/Label";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";

<ColumnLayout m={[1, 1]}>
  <RadioGroup
    variant="segmented"
    defaultValue="entwickler"
    containerBreakpointSize="xl"
  >
    <Label>Rolle</Label>
    <Radio value="entwickler">Entwickler</Radio>
    <Radio value="geschäftsführer">Geschäftsführer</Radio>
    <Radio value="andere">Andere</Radio>
  </RadioGroup>
  <RadioGroup
    variant="segmented"
    defaultValue="entwickler"
    containerBreakpointSize="xs"
  >
    <Label>Rolle</Label>
    <Radio value="entwickler">Entwickler</Radio>
    <Radio value="geschäftsführer">Geschäftsführer</Radio>
    <Radio value="andere">Andere</Radio>
  </RadioGroup>
</ColumnLayout>;
