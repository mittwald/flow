import {
  List,
  ListItem,
  ListItemView,
  ListStaticData,
} from "@mittwald/flow-react-components/List";
import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";
import Avatar from "@mittwald/flow-react-components/Avatar";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import ContextMenu, {
  MenuItem,
} from "@mittwald/flow-react-components/ContextMenu";
import {
  IconDomain,
  IconSubdomain,
} from "@mittwald/flow-react-components/Icons";
import AlertBadge from "@mittwald/flow-react-components/AlertBadge";

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
