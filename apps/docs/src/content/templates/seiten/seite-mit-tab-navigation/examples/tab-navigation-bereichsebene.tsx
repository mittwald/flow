import {
  ActionGroup,
  Avatar,
  Breadcrumb,
  Button,
  Flex,
  Heading,
  IconEmail,
  LayoutCard,
  Link,
  TabNavigation,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const MailAddressList = typedList<{
    id: string;
    address: string;
    usage: string;
  }>();

  return (
    <Flex direction="column" gap="m">
      <Flex direction="column">
        <Breadcrumb color="dark">
          <Link>Projekt</Link>
          <Link>E-Mails</Link>
        </Breadcrumb>
        <Heading color="dark" level={1}>
          E-Mails
        </Heading>
      </Flex>

      <LayoutCard>
        <TabNavigation aria-label="E-Mails">
          <Link href="#" aria-current="page">
            E-Mail-Adressen
          </Link>
          <Link href="#">Weiterleitungen</Link>
          <Link href="#">Delivery-Boxen</Link>
          <Link href="#">Archive</Link>
          <Link href="#">Einstellungen</Link>
        </TabNavigation>

        <MailAddressList.List
          aria-label="E-Mail-Adressen"
          getItemId={(mailAddress) => mailAddress.id}
          hidePagination
        >
          <ActionGroup>
            <Button>E-Mail-Adresse anlegen</Button>
          </ActionGroup>
          <MailAddressList.StaticData
            data={[
              {
                id: "1",
                address: "max@mustermann.de",
                usage: "1,2 von 2 GB belegt",
              },
              {
                id: "2",
                address: "info@mustermann.de",
                usage: "0,4 von 2 GB belegt",
              },
            ]}
          />
          <MailAddressList.Item
            href={() => "#"}
            textValue={(mailAddress) => mailAddress.address}
          >
            {(mailAddress) => (
              <MailAddressList.ItemView>
                <Avatar color="blue">
                  <IconEmail />
                </Avatar>
                <Heading>{mailAddress.address}</Heading>
                <Text>{mailAddress.usage}</Text>
              </MailAddressList.ItemView>
            )}
          </MailAddressList.Item>
        </MailAddressList.List>
      </LayoutCard>
    </Flex>
  );
};
