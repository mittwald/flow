import {
  ActionGroup,
  Avatar,
  Button,
  Heading,
  IconDomain,
  Text,
  typedList,
} from "@mittwald/flow-react-components";
import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";

export default () => {
  const DomainList = typedList<Domain>();

  return (
    <DomainList.List
      batchSize={2}
      hidePagination
      aria-label="Domains"
    >
      <DomainList.StaticData data={domains} />
      <ActionGroup>
        <Button color="accent">Anlegen</Button>
      </ActionGroup>
      <DomainList.Item
        textValue={(domain) => domain.domain}
      >
        {(domain) => (
          <DomainList.ItemView>
            <Avatar>
              <IconDomain />
            </Avatar>
            <Heading>{domain.hostname}</Heading>
            <Text>{domain.type}</Text>
          </DomainList.ItemView>
        )}
      </DomainList.Item>
    </DomainList.List>
  );
};
