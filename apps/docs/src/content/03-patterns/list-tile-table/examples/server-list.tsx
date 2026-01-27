import {
  ActionGroup,
  Avatar,
  Button,
  Flex,
  Heading,
  Initials,
  LayoutCard,
  ListItemView,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const ServerList = typedList<{
    id: string;
    description: string;
    customer: string;
    projectCount: number;
  }>();

  return (
    <Flex direction="column" gap="m">
      <Heading level={1} color="light">
        Server
      </Heading>
      <LayoutCard>
        <ServerList.List
          loadingItemsCount={3}
          getItemId={(server) => server.id}
          defaultViewMode="tiles"
        >
          <ServerList.StaticData
            data={[
              {
                id: "s-12345abc",
                description: "Blue Server",
                customer: "Meine Organisation",
                projectCount: 10,
              },
              {
                id: "s-12345def",
                description: "Hot Pink Server",
                customer: "Meine Organisation",
                projectCount: 2,
              },
              {
                id: "s-12345ghi",
                description: "Green Server",
                customer: "Andere Organisation",
                projectCount: 5,
              },
            ]}
          />
          <ServerList.Search />
          <ServerList.Sorting
            name="Von A bis Z"
            defaultEnabled
            direction="asc"
            property="description"
          />
          <ServerList.Sorting
            name="Von Z bis A"
            defaultEnabled
            direction="desc"
            property="description"
          />
          <ServerList.Filter
            name="Filter"
            property="customer"
          />
          <ServerList.Item showTiles>
            {(server) => (
              <ListItemView>
                <Avatar
                  color={
                    server.description === "Blue Server"
                      ? "blue"
                      : server.description ===
                          "Hot Pink Server"
                        ? "lilac"
                        : "green"
                  }
                >
                  <Initials>{server.description}</Initials>
                </Avatar>
                <Heading>{server.description}</Heading>
                <Text>{server.id}</Text>
                <Text>{server.projectCount} Projekte</Text>
              </ListItemView>
            )}
          </ServerList.Item>
          <ActionGroup>
            <Button color="accent">
              <Text>Tarif bestellen</Text>
            </Button>
          </ActionGroup>
        </ServerList.List>
      </LayoutCard>
    </Flex>
  );
};
