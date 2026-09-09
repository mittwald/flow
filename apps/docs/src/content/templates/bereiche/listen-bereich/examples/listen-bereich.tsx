import {
  ActionGroup,
  Avatar,
  Button,
  ContextMenu,
  Heading,
  IconDelete,
  IconEdit,
  IconForwardAddress,
  IllustratedMessage,
  LayoutCard,
  MenuItem,
  Section,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const ForwardList = typedList<{
    id: string;
    target: string;
    note: string;
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
          getItemId={(forward) => forward.id}
          emptyView={emptyView}
          hidePagination
        >
          <ActionGroup>
            <Button variant="soft" color="secondary">
              Weiterleitung anlegen
            </Button>
          </ActionGroup>

          <ForwardList.StaticData
            data={[
              {
                id: "1",
                target: "team@mustermann.de",
                note: "Seit 14. Februar 2026",
              },
              {
                id: "2",
                target: "archiv@mustermann.de",
                note: "Seit 2. März 2026",
              },
            ]}
          />

          <ForwardList.Item
            textValue={(forward) => forward.target}
          >
            {(forward) => (
              <ForwardList.ItemView>
                <Avatar color="teal">
                  <IconForwardAddress />
                </Avatar>
                <Heading>{forward.target}</Heading>
                <Text>{forward.note}</Text>
                <ContextMenu>
                  <MenuItem>
                    <IconEdit />
                    <Text>Bearbeiten</Text>
                  </MenuItem>
                  <MenuItem>
                    <IconDelete />
                    <Text>Löschen</Text>
                  </MenuItem>
                </ContextMenu>
              </ForwardList.ItemView>
            )}
          </ForwardList.Item>
        </ForwardList.List>
      </Section>
    </LayoutCard>
  );
};
