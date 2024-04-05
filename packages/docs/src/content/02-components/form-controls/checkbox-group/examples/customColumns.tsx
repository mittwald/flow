import CheckboxButton from "@mittwald/flow-react-components/CheckboxButton";
import { CheckboxGroup } from "@mittwald/flow-react-components/CheckboxGroup";
import { Label } from "@mittwald/flow-react-components/Label";

<CheckboxGroup l={[1, 1]}>
  <Label>Permissions</Label>
  <CheckboxButton value="read">Read</CheckboxButton>
  <CheckboxButton value="write">Write</CheckboxButton>
</CheckboxGroup>;
