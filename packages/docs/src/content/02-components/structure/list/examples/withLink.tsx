import {
  List,
  ListItemView,
  ListStaticData,
} from "@mittwald/flow-react-components/List";
import {
  type Domain,
  domains,
} from "@/content/02-components/structure/list/examples/domainApi";
import { Avatar } from "@mittwald/flow-react-components/Avatar";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { Text } from "@mittwald/flow-react-components/Text";
import ContextMenu, {
  ContextMenuItem,
} from "@mittwald/flow-react-components/ContextMenu";
import { Link } from "@mittwald/flow-react-components/Link";
import { IconDomain } from "@mittwald/flow-react-components/Icons";
import { IconFolders } from "@tabler/icons-react";

<List>
  <ListStaticData data={domains} />
  <ListItemView<Domain>>
    {(domain) => (
      <Link href="#">
        <Avatar>
          {domain.type === "domain" ? (
            <IconDomain />
          ) : (
            <IconFolders />
          )}
        </Avatar>
        <Heading>{domain.hostname}</Heading>
        <Text>{domain.type}</Text>
        <ContextMenu>
          <ContextMenuItem>Show details</ContextMenuItem>
          <ContextMenuItem>Delete</ContextMenuItem>
        </ContextMenu>
      </Link>
    )}
  </ListItemView>
</List>;
