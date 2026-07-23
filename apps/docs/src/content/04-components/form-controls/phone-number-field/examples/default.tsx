import {
  FieldError,
  Label,
} from "@mittwald/flow-react-components";
import { PhoneNumberField } from "@mittwald/flow-react-components/phone-tools";

export default () => (
  <PhoneNumberField>
    <Label>Telefonnummer</Label>
    <FieldError />
  </PhoneNumberField>
);
