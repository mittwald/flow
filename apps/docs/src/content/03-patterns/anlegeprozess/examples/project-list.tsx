import {
  ActionGroup,
  Avatar,
  Button,
  ContextMenu,
  Heading,
  IconInfo,
  IconProject,
  ListItemView,
  MenuItem,
  Text,
  typedList,
  LayoutCard,
} from "@mittwald/flow-react-components";

export default () => {
  const ProjectList = typedList<{
    id: string;
    name: string;
    type: string;
  }>();

  return (
    <LayoutCard>
      <ProjectList.List
        aria-label="Projekte"
        getItemId={(project) => project.id}
      >
        <ProjectList.StaticData
          data={[
            {
              id: "1",
              name: "Café-Gebäck-Haus",
              type: "Space-Server: Mein Server",
            },
            {
              id: "2",
              name: "Steelwork",
              type: "proSpace",
            },
            {
              id: "3",
              name: "UtopiaVRSchule",
              type: "proSpace lite",
            },
            {
              id: "4",
              name: "IT-Profis-Website",
              type: "Space-Server: Mein Server",
            },
          ]}
        />
        <ProjectList.Search />
        <ProjectList.Item
          textValue={(project) => project.name}
          showTiles
        >
          {(project) => (
            <ListItemView>
              <Avatar>
                <IconProject />
              </Avatar>
              <Heading>{project.name}</Heading>
              <Text>{project.type}</Text>
              <ContextMenu>
                <MenuItem>
                  <IconInfo />
                  <Text>Details anzeigen</Text>
                </MenuItem>
              </ContextMenu>
            </ListItemView>
          )}
        </ProjectList.Item>
        <ActionGroup>
          <Button color="secondary" variant="soft">
            Tarif bestellen
          </Button>
          <Button color="accent">Anlegen</Button>
        </ActionGroup>
      </ProjectList.List>
    </LayoutCard>
  );
};
