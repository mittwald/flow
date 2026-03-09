import {
  ActionGroup,
  Button,
  Heading,
  IconApp,
  IllustratedMessage,
  Text,
  LayoutCard,
  ModalTrigger,
  Modal,
  typedList,
  Content,
  ListItemView,
  Avatar,
  Action,
} from "@mittwald/flow-react-components";

export default () => {
  const AppList = typedList<{
    id: string;
    name: string;
  }>();

  return (
    <LayoutCard>
      <IllustratedMessage>
        <IconApp />
        <Heading>App anlegen</Heading>
        <Text>
          Lege deine erste App an, um mit der Arbeit an
          deiner Website loszulegen.
        </Text>

        <ActionGroup>
          <ModalTrigger>
            <Button color="accent">Anlegen</Button>
            <Modal offCanvas>
              <Heading>App anlegen</Heading>
              <Content>
                <AppList.List defaultViewMode="tiles">
                  <AppList.Search />
                  <AppList.StaticData
                    data={[
                      { id: "1", name: "PHP" },
                      { id: "2", name: "TYPO3" },
                      { id: "1", name: "WordPress" },
                    ]}
                  />
                  <AppList.Item showTiles showList={false}>
                    {(app) => (
                      <ListItemView>
                        <Avatar>
                          <IconApp />
                        </Avatar>
                        <Heading>{app.name}</Heading>
                      </ListItemView>
                    )}
                  </AppList.Item>
                </AppList.List>
              </Content>
              <ActionGroup>
                <Action closeModal>
                  <Button color="secondary" variant="soft">
                    Abbrechen
                  </Button>
                </Action>
              </ActionGroup>
            </Modal>
          </ModalTrigger>
        </ActionGroup>
      </IllustratedMessage>
    </LayoutCard>
  );
};
