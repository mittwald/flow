import {
  ActionGroup,
  Avatar,
  Button,
  ContextMenu,
  Flex,
  Heading,
  IconApp,
  LayoutCard,
  MenuItem,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const AppList = typedList<{
    id: string;
    name: string;
    type: string;
    domain: string;
  }>();

  return (
    <Flex direction="column" gap="m">
      <Heading level={1} color="dark">
        Apps
      </Heading>
      <LayoutCard>
        <AppList.List
          aria-label="Apps"
          getItemId={(app) => app.id}
          defaultViewMode="tiles"
        >
          <ActionGroup>
            <Button>App installieren</Button>
          </ActionGroup>

          <AppList.StaticData
            data={[
              {
                id: "1",
                name: "Mein Blog",
                type: "WordPress",
                domain: "mustermann.de",
              },
              {
                id: "2",
                name: "Shop",
                type: "Shopware",
                domain: "shop.mustermann.de",
              },
              {
                id: "3",
                name: "Redaktion",
                type: "TYPO3",
                domain: "redaktion.mustermann.de",
              },
            ]}
          />
          <AppList.Search />

          <AppList.Item
            showTiles
            showList={false}
            href={() => "#"}
            textValue={(app) => app.name}
          >
            {(app) => (
              <AppList.ItemView>
                <Avatar color="violet">
                  <IconApp />
                </Avatar>
                <Heading>{app.name}</Heading>
                <Text>{app.type}</Text>
                <ContextMenu>
                  <MenuItem>Details anzeigen</MenuItem>
                  <MenuItem>Löschen</MenuItem>
                </ContextMenu>
              </AppList.ItemView>
            )}
          </AppList.Item>
        </AppList.List>
      </LayoutCard>
    </Flex>
  );
};
