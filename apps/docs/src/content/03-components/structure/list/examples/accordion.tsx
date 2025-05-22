import {
  AlertBadge,
  Avatar,
  Content,
  Heading,
  IconDomain,
  IconSubdomain,
  List,
  ListItem,
  ListItemView,
  ListStaticData,
  Text,
} from "@mittwald/flow-react-components";
import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";

<List batchSize={2} accordion aria-label="Domains">
  <ListStaticData data={domains} />
  <ListItem<Domain>>
    {(domain) => (
      <ListItemView>
        <Avatar
          color={domain.type === "Domain" ? "blue" : "teal"}
        >
          {domain.type === "Domain" ? (
            <IconDomain />
          ) : (
            <IconSubdomain />
          )}
        </Avatar>
        <Heading>
          {domain.hostname}
          {!domain.verified && (
            <AlertBadge status="warning">
              Unverifiziert
            </AlertBadge>
          )}
        </Heading>
        <Text>{domain.type}</Text>
        <Content slot="bottom">Mehr Inhalt</Content>
      </ListItemView>
    )}
  </ListItem>
</List>;
