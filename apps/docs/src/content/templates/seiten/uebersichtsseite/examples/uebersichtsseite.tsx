import {
  ActionGroup,
  Avatar,
  Button,
  Content,
  ContextMenu,
  Flex,
  Heading,
  IconEdit,
  IconEmail,
  IconForwardAddress,
  IconInfo,
  IllustratedMessage,
  LayoutCard,
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
  }>();

  const emptyView = (
    <IllustratedMessage>
      <IconEmail />
      <Heading>Erste E-Mail-Adresse anlegen</Heading>
      <Text>
        In diesem Projekt gibt es noch keine
        E-Mail-Adressen. Lege eine an, um E-Mails zu
        empfangen.
      </Text>
      <Button>E-Mail-Adresse anlegen</Button>
    </IllustratedMessage>
  );

  return (
    <Flex direction="column" gap="m">
      <Heading level={1} color="dark">
        E-Mail-Adressen
      </Heading>
      <LayoutCard>
        <MailAddressList.List
          aria-label="E-Mail-Adressen"
          getItemId={(mailAddress) => mailAddress.id}
          emptyView={emptyView}
        >
          <ActionGroup>
            <Button>E-Mail-Adresse anlegen</Button>
          </ActionGroup>

          <MailAddressList.StaticData
            data={[
              {
                id: "1",
                address: "max@mustermann.de",
                type: "Postfach",
                usage: "1,2 von 2 GB belegt",
              },
              {
                id: "2",
                address: "info@mustermann.de",
                type: "Postfach",
                usage: "0,4 von 2 GB belegt",
              },
              {
                id: "3",
                address: "kontakt@mustermann.de",
                type: "Weiterleitung",
                usage: "an max@mustermann.de",
              },
            ]}
          />

          <MailAddressList.Search />
          <MailAddressList.Filter
            name="Typ"
            property="type"
          />
          <MailAddressList.Sorting
            defaultEnabled
            name="Alphabetisch"
            property="address"
            direction="asc"
            directionName="A – Z"
          />
          <MailAddressList.Sorting
            name="Alphabetisch"
            property="address"
            direction="desc"
            directionName="Z – A"
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
                <Heading>{mailAddress.address}</Heading>
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
                </ContextMenu>
              </MailAddressList.ItemView>
            )}
          </MailAddressList.Item>
        </MailAddressList.List>
      </LayoutCard>
    </Flex>
  );
};
