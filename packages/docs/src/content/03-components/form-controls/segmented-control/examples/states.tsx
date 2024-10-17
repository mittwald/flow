import {
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components/RadioGroup";
import { Label } from "@mittwald/flow-react-components/Label";
import { Column } from "@/lib/liveCode/components/LiveCodeEditor/components";

<Column>
  <RadioGroup variant="segmented" defaultValue="dev">
    <Label>Rolle</Label>
    <Radio value="entwickler">Entwickler</Radio>
    <Radio value="designer">Designer</Radio>
    <Radio value="geschäftsführer">Geschäftsführer</Radio>
    <Radio value="andere">Andere</Radio>
  </RadioGroup>
  <RadioGroup
    variant="segmented"
    defaultValue="dev"
    isDisabled
  >
    <Label>Rolle</Label>
    <Radio value="entwickler">Entwickler</Radio>
    <Radio value="designer">Designer</Radio>
    <Radio value="geschäftsführer">Geschäftsführer</Radio>
    <Radio value="andere">Andere</Radio>
  </RadioGroup>
</Column>;
