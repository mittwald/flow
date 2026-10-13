/** @jsxImportSource @/app/remote-vue/_lib */
import {
  Avatar,
  Badge,
  Content,
  ContextMenu,
  Heading,
  Initials,
  List,
  ListFilter,
  ListItem,
  ListItemView,
  ListSorting,
  ListStaticData,
  ListTableCell,
  ListTableColumn,
  MenuItem,
  Section,
  Text,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent } from "vue";

/**
 * The `list-selection` demo as a Vue remote app — the counterpart of
 * `src/app/remote/list-selection/page.tsx`.
 *
 * Selection is the host's: `selectionMode`, `selectedKeys` and `getItemId`
 * reach the grid list and the table untouched, which is also what the React
 * list does with them. The second list shows that the table view carries them
 * too.
 */
interface Crew {
  id: string;
  name: string;
  role: string;
  status: string;
}

const crew: Crew[] = [
  { id: "1", name: "Luke Skywalker", role: "Jedi Master", status: "active" },
  { id: "2", name: "Leia Organa", role: "Rebel Pilot", status: "unavailable" },
  { id: "3", name: "Han Solo", role: "Smuggler", status: "active" },
];

const getItemId = (item: Crew) => item.id;

export const ListSelectionDemo = defineComponent({
  name: "ListSelectionDemo",

  setup: () => () => [
    <Section>
      <List
        aria-label="Crew"
        getItemId={getItemId}
        selectedKeys={["2"]}
        selectionMode="multiple"
      >
        <ListStaticData data={crew} />
        <ListFilter property="role" name="Role" />
        <ListSorting property="name" name="Alphabetical" defaultEnabled />
        <ListItem textValue={(item: Crew) => item.name}>
          {{
            default: ({ data }: { data: Crew }) => (
              <ListItemView>
                <Avatar>
                  <Initials>{data.name}</Initials>
                </Avatar>
                <Heading>
                  {data.name}
                  {data.status === "active" ? <Badge>Active</Badge> : null}
                </Heading>
                <Text>{data.role}</Text>
                <Content>{data.role}</Content>
                <ContextMenu>
                  <MenuItem>Show details</MenuItem>
                  <MenuItem>Delete</MenuItem>
                </ContextMenu>
              </ListItemView>
            ),
          }}
        </ListItem>
      </List>
    </Section>,

    <Section>
      <Heading>Table view</Heading>
      <List
        aria-label="Crew table"
        defaultViewMode="table"
        getItemId={getItemId}
        selectedKeys={["1", "2"]}
        selectionMode="multiple"
      >
        <ListStaticData data={crew} />
        {/* Flat, not nested: the list reads its own children. */}
        <ListTableColumn>Name</ListTableColumn>
        <ListTableColumn>Role</ListTableColumn>
        <ListTableCell>
          {{ default: ({ data }: { data: Crew }) => data.name }}
        </ListTableCell>
        <ListTableCell>
          {{ default: ({ data }: { data: Crew }) => data.role }}
        </ListTableCell>
      </List>
    </Section>,
  ],
});
