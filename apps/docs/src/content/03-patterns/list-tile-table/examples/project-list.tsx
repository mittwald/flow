import {
  ActionGroup,
  Avatar,
  Button,
  Flex,
  Heading,
  Image,
  Initials,
  LayoutCard,
  ListItemView,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const ProjectList = typedList<{
    id: string;
    description: string;
    avatar?: string;
  }>();

  return (
    <Flex direction="column" gap="m">
      <Heading level={1} color="light">
        Projekte
      </Heading>
      <LayoutCard>
        <ProjectList.List
          aria-label="Projekte"
          loadingItemsCount={3}
          getItemId={(project) => project.id}
          defaultViewMode="tiles"
        >
          <ProjectList.StaticData
            data={[
              {
                id: "p-12345abc",
                description: "Green Portfolio",
                avatar:
                  "https://mittwald.github.io/flow/assets/mittwald_logo_rgb.jpg",
              },
              {
                id: "p-12345def",
                description: "Tante Mias Laden",
              },
              {
                id: "p-12345ghi",
                description: "User Experience Test",
              },
            ]}
          />
          <ProjectList.Search />
          <ProjectList.Sorting
            name="Von A bis Z"
            defaultEnabled
            direction="asc"
            property="description"
          />
          <ProjectList.Sorting
            name="Von Z bis A"
            defaultEnabled
            direction="desc"
            property="description"
          />
          <ProjectList.Item
            textValue={(project) => project.description}
            showTiles
            showList={false}
          >
            {(project) => (
              <ListItemView>
                <Avatar>
                  {project.avatar ? (
                    <Image src={project.avatar} />
                  ) : (
                    <Initials>
                      {project.description}
                    </Initials>
                  )}
                </Avatar>
                <Heading>{project.description}</Heading>
                <Text>{project.id}</Text>
              </ListItemView>
            )}
          </ProjectList.Item>
          <ActionGroup>
            <Button color="accent">
              <Text>Anlegen</Text>
            </Button>
          </ActionGroup>
        </ProjectList.List>
      </LayoutCard>
    </Flex>
  );
};
