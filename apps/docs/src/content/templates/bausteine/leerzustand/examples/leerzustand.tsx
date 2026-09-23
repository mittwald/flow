import {
  Button,
  Heading,
  IconEmail,
  IllustratedMessage,
  LayoutCard,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const MailAddressList = typedList<{
    id: string;
    address: string;
  }>();

  const emptyView = (
    <IllustratedMessage>
      <IconEmail />
      <Heading>Erste E-Mail-Adresse anlegen</Heading>
      <Text>
        Mit einer E-Mail-Adresse empfängst und versendest du
        E-Mails unter deiner eigenen Domain. Den
        Speicherplatz legst du beim Anlegen fest und kannst
        ihn jederzeit ändern.
      </Text>
      <Button>E-Mail-Adresse anlegen</Button>
    </IllustratedMessage>
  );

  return (
    <LayoutCard>
      <MailAddressList.List
        aria-label="E-Mail-Adressen"
        emptyView={emptyView}
        hidePagination
      >
        <MailAddressList.StaticData data={[]} />
        <MailAddressList.Item>
          {() => null}
        </MailAddressList.Item>
      </MailAddressList.List>
    </LayoutCard>
  );
};
