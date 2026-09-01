import {
  Button,
  Heading,
  IconSearch,
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
      <IconSearch />
      <Heading>Keine Treffer</Heading>
      <Text>
        Zu dieser Suche und diesen Filtern gibt es keine
        E-Mail-Adressen.
      </Text>
      <Button variant="soft" color="secondary">
        Filter zurücksetzen
      </Button>
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
