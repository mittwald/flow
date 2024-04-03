import List, {
  ListItemView,
  ListStaticData,
} from "@mittwald/flow-react-components/List";
import {
  type User,
  users,
} from "@/content/02-components/structure/list/examples/userApi";
import Avatar from "@mittwald/flow-react-components/Avatar";
import Initials from "@mittwald/flow-react-components/Initials";
import Heading from "@mittwald/flow-react-components/Heading";
import Text from "@mittwald/flow-react-components/Text";
import ContextMenu, {
  ContextMenuItem,
} from "@mittwald/flow-react-components/ContextMenu";
import Link from "@mittwald/flow-react-components/Link";

<List>
  <ListStaticData data={users} />
  <ListItemView<User>>
    {(user) => (
      <Link href={user.website}>
        <Avatar>
          <Initials>{`${user.name.first} ${user.name.last}`}</Initials>
        </Avatar>
        <Heading>
          {user.name.first} {user.name.last}
        </Heading>
        <Text>{user.location.state}</Text>
        <ContextMenu>
          <ContextMenuItem>Show details</ContextMenuItem>
          <ContextMenuItem>Delete</ContextMenuItem>
        </ContextMenu>
      </Link>
    )}
  </ListItemView>
</List>;
