import {
  ActionGroup,
  Avatar,
  Button,
  Content,
  Heading,
  IconEmail,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const List = typedList<{ mail: string }>();

  return (
    <List.List batchSize={6} aria-label="Domains">
      <List.StaticData data={[{ mail: "john@doe.de" }]} />
      <List.Item showTiles textValue={(mail) => mail.mail}>
        {(mail) => (
          <List.ItemView>
            <Avatar>
              <IconEmail />
            </Avatar>
            <Heading>{mail.mail}</Heading>

            <Content>
              <ActionGroup>
                <Button
                  variant="soft"
                  color="secondary"
                  slot="secondary"
                >
                  Bearbeiten
                </Button>
                <Button variant="soft" color="danger">
                  Löschen
                </Button>
              </ActionGroup>
            </Content>
          </List.ItemView>
        )}
      </List.Item>
    </List.List>
  );
};
