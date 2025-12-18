import {
  Avatar,
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
      getItemId={(domain) => domain.id}
    >
      <List.StaticData data={domains} />
      <List.Item
        href={() => "#"}
        textValue={(domain) => domain.domain}
      >
        {(domain) => (
          <List.ItemView>
            <Avatar>
              <IconDomain />
            </Avatar>
            <Heading>{domain.hostname}</Heading>

            <ContextMenu>
              <MenuItem>Details anzeigen</MenuItem>
            </ContextMenu>
          </List.ItemView>
        )}
      </List.Item>
    </List.List>
  );
};
