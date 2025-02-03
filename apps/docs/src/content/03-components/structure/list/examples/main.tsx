import {
  List,
  ListItem,
  ListItemView,
  ListStaticData,
} from "@mittwald/flow-react-components";
import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";
import { Avatar } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import {
  ContextMenu,
  MenuItem,
} from "@mittwald/flow-react-components";
import {
  IconDomain,
  IconSubdomain,
} from "@mittwald/flow-react-components";
import { AlertBadge } from "@mittwald/flow-react-components";

<List batchSize={2}>
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

        <ContextMenu>
          <MenuItem>Details anzeigen</MenuItem>
          <MenuItem>Löschen</MenuItem>
        </ContextMenu>
      </ListItemView>
    )}
  </ListItem>
</List>;
