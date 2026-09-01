import {
  Avatar,
  ContextMenu,
  Heading,
  IconDelete,
  IconEdit,
  IconEmail,
  IconInfo,
  MenuItem,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const MailAddressList = typedList<{
    id: string;
    address: string;
  }>();

  return (
    <MailAddressList.List
      aria-label="E-Mail-Adressen"
      getItemId={(mailAddress) => mailAddress.id}
      hidePagination
    >
      <MailAddressList.StaticData
        data={[
          { id: "1", address: "max@mustermann.de" },
          { id: "2", address: "info@mustermann.de" },
        ]}
      />
      <MailAddressList.Item
        textValue={(mailAddress) => mailAddress.address}
      >
        {(mailAddress) => (
          <MailAddressList.ItemView>
            <Avatar color="blue">
              <IconEmail />
            </Avatar>
            <Heading>{mailAddress.address}</Heading>
            <Text>Postfach</Text>
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
