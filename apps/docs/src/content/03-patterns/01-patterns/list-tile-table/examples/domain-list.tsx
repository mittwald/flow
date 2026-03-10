import {
  ActionGroup,
  Avatar,
  Button,
  Content,
  ContextMenu,
  ContextMenuTrigger,
  Flex,
  Heading,
  IconChevronDown,
  IconDomain,
  IconHome,
  IconInfo,
  IconMove,
  IconSubdomain,
  IconVhost,
  LayoutCard,
  ListItemView,
  MenuItem,
  Text,
  typedList,
} from "@mittwald/flow-react-components";

export default () => {
  const DomainList = typedList<{
    id: string;
    domain: string;
    type: string;
    target?: string;
  }>();

  return (
    <Flex direction="column" gap="m">
      <Heading level={1} color="dark">
        Domains
      </Heading>
      <LayoutCard>
        <DomainList.List
          aria-label="Domains"
          loadingItemsCount={3}
          getItemId={(domain) => domain.id}
        >
          <DomainList.StaticData
            data={[
              {
                id: "1",
                domain: "mjaofd6.project.space",
                type: "Projekt-Domain",
              },
              {
                id: "2",
                domain: "formel1.de",
                type: "Domain",
                target: "Mein WordPress",
              },
              {
                id: "3",
                domain: "schumi-fanclub.de",
                type: "Virtual Host",
                target: "Mein WordPress",
              },
            ]}
          />
          <DomainList.Search />
          <DomainList.Filter name="Typ" property="type" />
          <DomainList.Item
            textValue={(domain) => domain.domain}
          >
            {(domain) => (
              <ListItemView>
                <Avatar
                  color={
                    domain.type === "Projekt-Domain"
                      ? "violet"
                      : domain.type === "Subdomain"
                        ? "green"
                        : domain.type === "Domain"
                          ? "blue"
                          : "teal"
                  }
                >
                  {domain.type === "Projekt-Domain" ? (
                    <IconHome />
                  ) : domain.type === "Subdomain" ? (
                    <IconSubdomain />
                  ) : domain.type === "Domain" ? (
                    <IconDomain />
                  ) : (
                    <IconVhost />
                  )}
                </Avatar>
                <Heading>{domain.domain}</Heading>
                <Text>{domain.type}</Text>
                <Content>
                  <small>
                    {domain.target
                      ? domain.target
                      : "Kein Ziel"}
                  </small>
                </Content>
                <ContextMenu>
                  <MenuItem>
                    <IconInfo />
                    <Text>Details anzeigen</Text>
                  </MenuItem>
                </ContextMenu>
              </ListItemView>
            )}
          </DomainList.Item>
          <ActionGroup>
            <ContextMenuTrigger>
              <Button color="accent">
                <Text>Hinzufügen</Text>
                <IconChevronDown />
              </Button>
              <ContextMenu>
                <MenuItem>
                  <IconDomain />
                  <Text>Domain bestellen</Text>
                </MenuItem>
                <MenuItem>
                  <IconMove />
                  <Text>Domain umziehen</Text>
                </MenuItem>
                <MenuItem>
                  <IconVhost />
                  <Text>vHost einrichten</Text>
                </MenuItem>
                <MenuItem>
                  <IconSubdomain />
                  <Text>Subdomain anlegen</Text>
                </MenuItem>
              </ContextMenu>
            </ContextMenuTrigger>
          </ActionGroup>
        </DomainList.List>
      </LayoutCard>
    </Flex>
  );
};
