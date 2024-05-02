import List, {
  ListItemView,
  ListStaticData,
} from "@mittwald/flow-react-components/List";
import {
  type Domain,
  domains,
} from "@/content/02-components/structure/list/examples/domainApi";
import Avatar from "@mittwald/flow-react-components/Avatar";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import ContextMenu, {
  MenuItem,
} from "@mittwald/flow-react-components/ContextMenu";
import Link from "@mittwald/flow-react-components/Link";
import {
  IconDomain,
  IconSubdomain,
} from "@mittwald/flow-react-components/Icons";
import StatusBadge from "@mittwald/flow-react-components/StatusBadge";

<List batchSize={5}>
  <ListStaticData data={domains} />
  <ListItemView<Domain>>
    {(domain) => (
      <Link href="#">
        <Avatar variant={domain.type === "Domain" ? 1 : 2}>
          {domain.type === "Domain" ? (
            <IconDomain />
          ) : (
            <IconSubdomain />
          )}
        </Avatar>
        <Heading>{domain.hostname}</Heading>
        {domain.verified ? (
          <Text>{domain.type}</Text>
        ) : (
          <StatusBadge status="warning">
            Nicht verifiziert
          </StatusBadge>
        )}
        <ContextMenu>
          <MenuItem>Details anzeigen</MenuItem>
          <MenuItem>Löschen</MenuItem>
        </ContextMenu>
      </Link>
    )}
  </ListItemView>
</List>;
