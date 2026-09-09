import {
  AlertBadge,
  Avatar,
  Content,
  ContextMenu,
  Heading,
  IconDelete,
  IconEdit,
  IconEmail,
  IconForwardAddress,
  IconInfo,
  MenuItem,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const MailAddressList = typedList<{
    id: string;
    address: string;
    type: string;
    usage: string;
    verified: boolean;
  }>();

  return (
    <MailAddressList.List
      aria-label="E-Mail-Adressen"
      getItemId={(mailAddress) => mailAddress.id}
      hidePagination
    >
      <MailAddressList.StaticData
        data={[
          {
            id: "1",
            address: "max@mustermann.de",
            type: "Postfach",
            usage: "1,2 von 2 GB belegt",
            verified: true,
          },
          {
            id: "2",
            address: "info@mustermann.de",
            type: "Postfach",
            usage: "0,4 von 2 GB belegt",
            verified: false,
          },
          {
            id: "3",
            address: "kontakt@mustermann.de",
            type: "Weiterleitung",
            usage: "an max@mustermann.de",
            verified: true,
          },
        ]}
      />

      <MailAddressList.Item
        href={() => "#"}
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
            <Content>
              <Text>{mailAddress.usage}</Text>
            </Content>
            <ContextMenu>
              <MenuItem>
                <IconInfo />
                <Text>Details anzeigen</Text>
              </MenuItem>
              <MenuItem>
                <IconEdit />
                <Text>Bearbeiten</Text>
              </MenuItem>
              <MenuItem>
                <IconDelete />
                <Text>Löschen</Text>
              </MenuItem>
            </ContextMenu>
          </MailAddressList.ItemView>
        )}
      </MailAddressList.Item>
    </MailAddressList.List>
  );
};
