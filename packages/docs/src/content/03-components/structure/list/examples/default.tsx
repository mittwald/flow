import List, {
  ListFilter,
  ListItem,
  ListItemView,
  ListSorting,
  ListStaticData,
} from "@mittwald/flow-react-components/List";
import {
  type Domain,
  domains,
} from "@/content/03-components/structure/list/examples/domainApi";
import Avatar from "@mittwald/flow-react-components/Avatar";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import ContextMenu from "@mittwald/flow-react-components/ContextMenu";
import {
  IconDomain,
  IconSubdomain,
} from "@mittwald/flow-react-components/Icons";
import StatusBadge from "@mittwald/flow-react-components/StatusBadge";
import MenuItem from "@mittwald/flow-react-components/MenuItem";

<List batchSize={5}>
  <ListStaticData data={domains} />
  <ListFilter<Domain>
    property="type"
    mode="some"
    name="Type"
  />
  <ListSorting<Domain> property="domain" name="Domain" />
  <ListSorting<Domain> property="type" name="Type" />
  <ListItemView<Domain>>
    {(domain) => (
      <ListItem>
        <Avatar variant={domain.type === "Domain" ? 1 : 2}>
          {domain.type === "Domain" ? (
            <IconDomain />
          ) : (
            <IconSubdomain />
          )}
        </Avatar>
        <Heading>
          {domain.hostname}
          {!domain.verified && (
            <StatusBadge status="warning">
              Not verified
            </StatusBadge>
          )}
        </Heading>
        <Text>{domain.type}</Text>

        <ContextMenu>
          <MenuItem>Details anzeigen</MenuItem>
          <MenuItem>Löschen</MenuItem>
        </ContextMenu>
      </ListItem>
    )}
  </ListItemView>
</List>;
