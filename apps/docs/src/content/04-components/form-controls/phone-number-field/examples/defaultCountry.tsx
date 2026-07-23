import {
  FieldDescription,
  FieldError,
  Label,
} from "@mittwald/flow-react-components";
import { PhoneNumberField } from "@mittwald/flow-react-components/phone-tools";

export default () => (
  <PhoneNumberField defaultCountry="AT">
    <Label>Telefonnummer</Label>
    <FieldDescription>
      Nummern ohne Vorwahl werden als österreichisch (+43)
      interpretiert
    </FieldDescription>
    <FieldError />
  </PhoneNumberField>
);
