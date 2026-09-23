import {
  AlertBadge,
  Avatar,
  ContextMenu,
  Heading,
  IconEmail,
  IconForwardAddress,
  MenuItem,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const MailAddressList = typedList<{
    id: string;
    address: string;
    type: string;
    verified: boolean;
  }>();

  return (
    <MailAddressList.List
      aria-label="E-Mail-Adressen"
      getItemId={(mailAddress) => mailAddress.id}
      defaultViewMode="tiles"
      hidePagination
    >
      <MailAddressList.StaticData
        data={[
          {
            id: "1",
            address: "max@mustermann.de",
            type: "Postfach",
            verified: true,
          },
          {
            id: "2",
            address: "info@mustermann.de",
            type: "Postfach",
            verified: false,
          },
          {
            id: "3",
            address: "kontakt@mustermann.de",
            type: "Weiterleitung",
            verified: true,
          },
        ]}
      />

      <MailAddressList.Item
        showTiles
        showList={false}
        textValue={(mailAddress) => mailAddress.address}
      >
        {(mailAddress) => (
          <MailAddressList.ItemView>
            <Avatar
              color={
                mailAddress.type === "Weiterleitung"
                  ? "teal"
                  : "blue"
              }
            >
              {mailAddress.type === "Weiterleitung" ? (
                <IconForwardAddress />
              ) : (
                <IconEmail />
              )}
            </Avatar>
            <Heading>
              {mailAddress.address}
              {!mailAddress.verified && (
                <AlertBadge status="warning">
                  Nicht verifiziert
                </AlertBadge>
              )}
            </Heading>
            <Text>{mailAddress.type}</Text>
            <ContextMenu>
              <MenuItem>Details anzeigen</MenuItem>
              <MenuItem>Löschen</MenuItem>
            </ContextMenu>
          </MailAddressList.ItemView>
        )}
      </MailAddressList.Item>
    </MailAddressList.List>
  );
};
