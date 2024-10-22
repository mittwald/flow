import {
  Radio,
  RadioGroup,
} from "@mittwald/flow-react-components/RadioGroup";
import { Label } from "@mittwald/flow-react-components/Label";
import { useState } from "react";
import { FieldDescription } from "@mittwald/flow-react-components/FieldDescription";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { TextField } from "@mittwald/flow-react-components/TextField";
import { Section } from "@mittwald/flow-react-components/Section";

export default () => {
  const [showContent, setShowContent] =
    useState<boolean>(false);

  return (
    <Section>
      <RadioGroup
        variant="segmented"
        defaultValue="lastschrift"
        s={[1, 1]}
        onChange={() => setShowContent(!showContent)}
      >
        <Label>Zahlungsart</Label>
        <Radio value="lastschrift">Lastschrift</Radio>
        <Radio value="Rechnung">Rechnung</Radio>
        {showContent && (
          <FieldDescription>
            Wähle bitte eine Bankverbindung für die
            Bezahlung mit SEPA-Lastschrift aus.
          </FieldDescription>
        )}
      </RadioGroup>
      {showContent && (
        <ColumnLayout>
          <TextField isRequired>
            <Label>Kontoinhaber</Label>
          </TextField>
          <TextField isRequired>
            <Label>IBAN</Label>
          </TextField>
        </ColumnLayout>
      )}
    </Section>
  );
};
