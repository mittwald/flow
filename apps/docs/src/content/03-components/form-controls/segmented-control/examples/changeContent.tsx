import { Label } from "@mittwald/flow-react-components";
import { useState } from "react";
import { FieldDescription } from "@mittwald/flow-react-components";
import { ColumnLayout } from "@mittwald/flow-react-components";
import { TextField } from "@mittwald/flow-react-components";
import { Section } from "@mittwald/flow-react-components";
import {
  Segment,
  SegmentedControl,
} from "@mittwald/flow-react-components";

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
