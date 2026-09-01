import {
  ActionGroup,
  Button,
  Heading,
  IconForwardAddress,
  IllustratedMessage,
  LayoutCard,
  Section,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const ForwardList = typedList<{
    id: string;
    target: string;
  }>();

  const emptyView = (
    <IllustratedMessage>
      <IconForwardAddress />
      <Heading>Keine Weiterleitungen eingerichtet</Heading>
      <Text>
        Eingehende E-Mails werden ausschließlich im Postfach
        abgelegt.
      </Text>
      <Button>Weiterleitung anlegen</Button>
    </IllustratedMessage>
  );

  return (
    <LayoutCard>
      <Section>
        <Heading>Weiterleitungen</Heading>
        <Text>
          Eingehende E-Mails werden zusätzlich an diese
          Adressen zugestellt.
        </Text>
        <ForwardList.List
          aria-label="Weiterleitungen"
          emptyView={emptyView}
          hidePagination
        >
          <ActionGroup>
            <Button variant="soft" color="secondary">
              Weiterleitung anlegen
            </Button>
          </ActionGroup>
          <ForwardList.StaticData data={[]} />
          <ForwardList.Item>{() => null}</ForwardList.Item>
        </ForwardList.List>
      </Section>
    </LayoutCard>
  );
};
