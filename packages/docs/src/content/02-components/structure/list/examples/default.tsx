import {
  List,
  ListItemView,
  ListStaticData,
} from "@mittwald/flow-react-components/List";
import {
  type User,
  users,
} from "@/content/02-components/structure/list/examples/userApi";

<List>
  <ListStaticData data={users} />
  <ListItemView<User>>
    {(user) => (
      <>
        {user.name.first} {user.name.last}
      </>
    )}
  </ListItemView>
</List>;
