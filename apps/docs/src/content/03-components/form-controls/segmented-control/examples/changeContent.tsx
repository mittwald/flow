import { Label } from "@mittwald/flow-react-components/Label";
import { useState } from "react";
import { FieldDescription } from "@mittwald/flow-react-components/FieldDescription";
import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { TextField } from "@mittwald/flow-react-components/TextField";
import { Section } from "@mittwald/flow-react-components/Section";
import {
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components/SegmentedControl";

export default () => {
  const [showContent, setShowContent] =
    useState<boolean>(false);

  return (
    <Section>
      <SegmentedControl
        defaultValue="lastschrift"
        onChange={() => setShowContent(!showContent)}
      >
        <Label>Zahlungsart</Label>
        <Segment value="lastschrift">Lastschrift</Segment>
        <Segment value="Rechnung">Rechnung</Segment>
        {showContent && (
          <FieldDescription>
            Wähle bitte eine Bankverbindung für die
            Bezahlung mit SEPA-Lastschrift aus.
          </FieldDescription>
        )}
      </SegmentedControl>
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
