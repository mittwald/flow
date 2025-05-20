import {
  AlertBadge,
  Avatar,
  ContextMenu,
  Heading,
  IconDomain,
  IconSubdomain,
  List,
  ListItem,
  ListItemView,
  ListStaticData,
  MenuItem,
  Text,
} from "@mittwald/flow-react-components";
import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";

<List batchSize={2}>
  <ListStaticData data={domains} aria-label="Domains" />
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

        <ContextMenu>
          <MenuItem>Details anzeigen</MenuItem>
          <MenuItem>Löschen</MenuItem>
        </ContextMenu>
      </ListItemView>
    )}
  </ListItem>
</List>;
