/** @jsxImportSource @/app/remote-vue/_lib */
import { ComponentGroupPage } from "@/app/remote-vue/_demos/components/lib/ComponentGroupPage";
import {
  demoData,
  type DemoCharacter,
} from "@/app/remote/components/list/demoData";
import {
  Action,
  ActionGroup,
  Avatar,
  Badge,
  BrowserOnly,
  Button,
  Content,
  ContextMenu,
  Heading,
  IconEmail,
  Initials,
  List,
  ListFilter,
  ListItem,
  ListItemView,
  ListLoaderAsync,
  ListSearch,
  ListSorting,
  ListStaticData,
  ListTableCell,
  ListTableColumn,
  MenuItem,
  Modal,
  Section,
  Text,
  useModalController,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, type PropType } from "vue";

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

const loadCharacters = () =>
  new Promise<{ data: DemoCharacter[]; itemTotalCount: number }>((resolve) => {
    setTimeout(
      () => resolve({ data: demoData, itemTotalCount: demoData.length }),
      1500,
    );
  });

/*
 * A component rather than a render function: the modal's controller has to
 * survive the item's re-renders, and a slot function has nowhere to keep one.
 */
const CharacterItem = defineComponent({
  name: "CharacterItem",

  props: {
    data: { type: Object as PropType<DemoCharacter>, required: true },
  },

  setup(props) {
    const controller = useModalController();

    return () => (
      <>
        <ListItemView>
          <Avatar>
            <IconEmail />
          </Avatar>
          <Heading>
            {props.data.name} ({props.data.faction})
          </Heading>
          <Text>{props.data.bio.slice(0, 100)}</Text>
          <ContextMenu>
            <MenuItem onAction={controller.open}>
              <IconEmail />
              <Text>Send message</Text>
            </MenuItem>
          </ContextMenu>
        </ListItemView>
        <Modal controller={controller}>
          <Heading>{props.data.name}</Heading>
          <Content>
            <Section>
              <Heading level={3}>{props.data.faction}</Heading>
              <Text>{props.data.bio}</Text>
            </Section>
          </Content>
          <ActionGroup>
            <Action closeModal>
              <Button>Cancel</Button>
            </Action>
          </ActionGroup>
        </Modal>
      </>
    );
  },
});

/**
 * The counterpart of `src/app/remote/components/list/page.tsx`.
 *
 * The first list is an async loader that takes its time, two filters, a search,
 * two sortings, tiles, a table view, and a context menu per item that opens
 * that item's own modal. The second one shows selection, which turns every item
 * and table row into a checkbox and therefore cannot share a list with the
 * first one's item links. `ListItemView` is in both.
 */
export const ListComponentsDemo = defineComponent({
  name: "ListComponentsDemo",

  setup: () => () => (
    <ComponentGroupPage title="List">
      <BrowserOnly>
        <Section>
          <Heading level={3}>List</Heading>
          <List
            aria-label="Demo"
            batchSize={10}
            onAction={(data: DemoCharacter) => console.log(data)}
          >
            <ListLoaderAsync loader={loadCharacters} />

            <ListFilter property="faction" name="Faction" mode="some" />
            {/* `secondary` keeps it out of the header — it lives in the
                all-filters modal, which is what puts that modal on desktop.
                `one` renders it there as a radio group. */}
            <ListFilter
              property="homeworld"
              name="Homeworld"
              mode="one"
              priority="secondary"
            />
            <ListSearch />
            <ListSorting property="name" name="Name" direction="asc" />
            <ListSorting
              property="name"
              name="Name"
              direction="desc"
              directionName="descending"
            />

            {/* The href makes the host render a real anchor, so the browser's
                context menu, middle-click and modifier-click work on an item. */}
            <ListItem
              textValue={(data: DemoCharacter) => data.name}
              href={(data: DemoCharacter) => `#${data.name}`}
              showTiles
            >
              {{
                default: ({ data }: { data: DemoCharacter }) => (
                  <CharacterItem data={data} key={data.id} />
                ),
              }}
            </ListItem>

            {/* Flat, not nested: the list reads its own children. */}
            <ListTableColumn>Name</ListTableColumn>
            <ListTableCell>
              {{ default: ({ data }: { data: DemoCharacter }) => data.name }}
            </ListTableCell>
          </List>
        </Section>

        <Section>
          <Heading level={3}>List with selection</Heading>
          <List
            aria-label="Crew"
            getItemId={(item: Crew) => item.id}
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
                    <ContextMenu>
                      <MenuItem>Show details</MenuItem>
                      <MenuItem>Delete</MenuItem>
                    </ContextMenu>
                  </ListItemView>
                ),
              }}
            </ListItem>
            <ListTableColumn>Name</ListTableColumn>
            <ListTableColumn>Role</ListTableColumn>
            <ListTableCell>
              {{ default: ({ data }: { data: Crew }) => data.name }}
            </ListTableCell>
            <ListTableCell>
              {{ default: ({ data }: { data: Crew }) => data.role }}
            </ListTableCell>
          </List>
        </Section>
      </BrowserOnly>
    </ComponentGroupPage>
  ),
});
