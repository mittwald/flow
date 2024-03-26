import {
  List,
  ListItemView,
  ListStaticData,
  ListItemContextMenu,
} from "@mittwald/flow-react-components/List";
import {
  type User,
  users,
} from "@/content/02-components/structure/list/examples/userApi";
import { Avatar } from "@mittwald/flow-react-components/Avatar";
import { Initials } from "@mittwald/flow-react-components/Initials";
import { Heading } from "@mittwald/flow-react-components/Heading";

<List>
  <ListStaticData data={users} />
  <ListItemView<User>>
    {(user) => (
      <>
        <Avatar>
          <Initials>{`${user.name.first} ${user.name.last}`}</Initials>
        </Avatar>
        <Heading>
          {user.name.first} {user.name.last}
        </Heading>
        <Text>{user.location.state}</Text>
        <ListItemContextMenu>
          <ContextMenuItem>Show details</ContextMenuItem>
          <ContextMenuItem>Delete</ContextMenuItem>
        </ListItemContextMenu>
      </>
    )}
  </ListItemView>
</List>;
