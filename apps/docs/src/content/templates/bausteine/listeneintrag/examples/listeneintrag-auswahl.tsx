import {
  ActionGroup,
  Avatar,
  Button,
  Checkbox,
  Heading,
  IconEmail,
  Text,
  typedList,
} from "@mittwald/flow-react-components";
import { useState } from "react";

interface MailAddress {
  id: string;
  address: string;
  type: string;
}

export default () => {
  const mailAddresses: MailAddress[] = [
    {
      id: "1",
      address: "max@mustermann.de",
      type: "Postfach",
    },
    {
      id: "2",
      address: "info@mustermann.de",
      type: "Postfach",
    },
    {
      id: "3",
      address: "kontakt@mustermann.de",
      type: "Postfach",
    },
  ];

  const MailAddressList = typedList<MailAddress>();

  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id],
    );

  return (
    <MailAddressList.List
      aria-label="E-Mail-Adressen"
      getItemId={(mailAddress) => mailAddress.id}
      onAction={(mailAddress) => toggle(mailAddress.id)}
      hidePagination
    >
      <ActionGroup>
        <Button
          color="danger"
          variant="soft"
          isDisabled={selected.length === 0}
        >
          {selected.length > 0
            ? `${selected.length} Adressen löschen`
            : "Adressen löschen"}
        </Button>
      </ActionGroup>

      <MailAddressList.StaticData data={mailAddresses} />

      <MailAddressList.Item
        textValue={(mailAddress) => mailAddress.address}
      >
        {(mailAddress) => (
          <MailAddressList.ItemView>
            <Checkbox
              isSelected={selected.includes(mailAddress.id)}
              onChange={() => toggle(mailAddress.id)}
              aria-label={`${mailAddress.address} auswählen`}
            />
            <Avatar color="blue">
              <IconEmail />
            </Avatar>
            <Heading>{mailAddress.address}</Heading>
            <Text>{mailAddress.type}</Text>
          </MailAddressList.ItemView>
        )}
      </MailAddressList.Item>
    </MailAddressList.List>
  );
};
