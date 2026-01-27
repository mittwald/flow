import {
  Avatar,
  Content,
  Heading,
  IconDomain,
  ListItemView,
  Text,
  typedList,
} from "@mittwald/flow-react-components";
import {
  type Domain,
  domains,
} from "@/content/04-components/structure/list/examples/domainApi";

export default () => {
  const List = typedList<Domain>();

  return (
    <List.List
      batchSize={2}
      hidePagination
      accordion
      aria-label="Domains"
      getItemId={(domain) => domain.id}
    >
      <List.StaticData data={domains} />
      <List.Item textValue={(domain) => domain.domain}>
        {(domain) => (
          <ListItemView>
            <Avatar>
              <IconDomain />
            </Avatar>
            <Heading>{domain.hostname}</Heading>
            <Text>{domain.type}</Text>
            <Content slot="bottom">Mehr Inhalt</Content>
          </ListItemView>
        )}
      </List.Item>
    </List.List>
  );
};
