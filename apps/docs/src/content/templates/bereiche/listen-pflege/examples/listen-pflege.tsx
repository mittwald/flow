import {
  ActionGroup,
  Button,
  Flex,
  Heading,
  IconDelete,
  Label,
  LayoutCard,
  Section,
  Text,
  TextField,
  typedList,
} from "@mittwald/flow-react-components";
import { useState } from "react";

export default () => {
  const RecipientList = typedList<{
    id: string;
    address: string;
  }>();

  const [draft, setDraft] = useState("");

  return (
    <LayoutCard>
      <Section>
        <Heading>Zusätzlicher Rechnungsempfänger</Heading>
        <Text>
          Es können zusätzliche Rechnungsempfänger
          hinterlegt werden, die die Rechnung ebenfalls per
          E-Mail erhalten.
        </Text>

        <Flex direction="row" gap="s" align="end">
          <TextField
            value={draft}
            onChange={setDraft}
            type="email"
          >
            <Label>E-Mail-Adresse</Label>
          </TextField>
          <Button isDisabled={draft.length === 0}>
            Hinzufügen
          </Button>
        </Flex>

        <RecipientList.List
          aria-label="Zusätzliche Rechnungsempfänger"
          getItemId={(recipient) => recipient.id}
          hidePagination
        >
          <RecipientList.StaticData
            data={[
              {
                id: "1",
                address: "buchhaltung@mustermann.de",
              },
              {
                id: "2",
                address: "steuerberatung@mustermann.de",
              },
            ]}
          />
          <RecipientList.Item
            textValue={(recipient) => recipient.address}
          >
            {(recipient) => (
              <RecipientList.ItemView>
                <Heading>{recipient.address}</Heading>
                <ActionGroup>
                  <Button
                    variant="plain"
                    color="secondary"
                    aria-label={`${recipient.address} entfernen`}
                  >
                    <IconDelete />
                  </Button>
                </ActionGroup>
              </RecipientList.ItemView>
            )}
          </RecipientList.Item>
        </RecipientList.List>
      </Section>
    </LayoutCard>
  );
};
