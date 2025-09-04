import {
  Avatar,
  Content,
  ContextMenu,
  Heading,
  IconDomain,
  MenuItem,
  typedList,
} from "@mittwald/flow-react-components";
import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";

export default () => {
  const List = typedList<Domain>();

  return (
    <List.List
      batchSize={2}
      hidePagination
      aria-label="Domains"
    >
      <List.StaticData data={domains} />
      <List.Item
        showTiles
        textValue={(domain) => domain.domain}
      >
        {(domain) => (
          <List.ItemView>
            <Avatar>
              <IconDomain />
            </Avatar>
            <Heading>{domain.hostname}</Heading>

            <Content slot="top">Top Content</Content>
            <Content slot="bottom">Bottom Content</Content>

            <ContextMenu>
              <MenuItem>Details anzeigen</MenuItem>
            </ContextMenu>
          </List.ItemView>
        )}
      </List.Item>
    </List.List>
  );
};
