import {
  Avatar,
  Heading,
  IconDomain,
  Skeleton,
  SkeletonText,
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
    <List.List aria-label="Domains">
      {/* The loader waits a moment before resolving, so the loading view is
          briefly visible before the data appears. */}
      <List.LoaderAsync>
        {() =>
          new Promise<{ data: Domain[] }>((resolve) => {
            setTimeout(
              () => resolve({ data: domains.slice(0, 3) }),
              2000,
            );
          })
        }
      </List.LoaderAsync>
      <List.Item
        textValue={(domain) => domain.hostname}
        loadingView={
          <List.ItemView>
            <Avatar>
              <Skeleton />
            </Avatar>
            <Heading>
              <SkeletonText width="12em" />
            </Heading>
            <SkeletonText width="6em" />
          </List.ItemView>
        }
      >
        {(domain) => (
          <List.ItemView>
            <Avatar>
              <IconDomain />
            </Avatar>
            <Heading>{domain.hostname}</Heading>
            <Text>{domain.type}</Text>
          </List.ItemView>
        )}
      </List.Item>
    </List.List>
  );
};
