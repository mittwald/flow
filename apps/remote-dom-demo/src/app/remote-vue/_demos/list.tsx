/** @jsxImportSource @/app/remote-vue/_lib */
import { demoData, type DemoCharacter } from "@/app/remote/list/demoData";
import {
  Action,
  ActionGroup,
  Avatar,
  Button,
  Content,
  ContextMenu,
  Heading,
  IconEmail,
  List,
  ListFilter,
  ListItem,
  ListItemView,
  ListLoaderAsync,
  ListSearch,
  ListSorting,
  ListTableCell,
  ListTableColumn,
  MenuItem,
  Modal,
  Section,
  Text,
  useOverlayController,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, type PropType } from "vue";

/**
 * The `list` demo as a Vue remote app — the counterpart of
 * `src/app/remote/list/page.tsx`.
 *
 * Deliberately the same list: an async loader that takes its time, a filter, a
 * search, tiles, a table view, and a context menu per item that opens that
 * item's own modal.
 */
const loadCharacters = () =>
  new Promise<{ data: DemoCharacter[]; itemTotalCount: number }>((resolve) => {
    setTimeout(
      () => resolve({ data: demoData, itemTotalCount: demoData.length }),
      1500,
    );
  });

/**
 * One item, as a component rather than a render function.
 *
 * The modal's controller has to survive the item's re-renders, and a slot
 * function has nowhere to keep one — React's page calls `useModalController()`
 * inside its item render because a hook there is a hook in the component that
 * renders it. The Vue equivalent of that is a component with a `setup()`.
 */
const CharacterItem = defineComponent({
  name: "CharacterItem",

  props: {
    data: { type: Object as PropType<DemoCharacter>, required: true },
  },

  setup(props) {
    const controller = useOverlayController();

    return () => [
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
      </ListItemView>,
      <Modal controller={controller}>
        <Heading>{props.data.name}</Heading>
        <Content>
          <Section>
            <Heading>{props.data.faction}</Heading>
            <Text>{props.data.bio}</Text>
          </Section>
        </Content>
        <ActionGroup>
          <Action closeModal>
            <Button>Cancel</Button>
          </Action>
        </ActionGroup>
      </Modal>,
    ];
  },
});

export const ListDemo = defineComponent({
  name: "ListDemo",

  setup: () => () => (
    <Section>
      <List
        aria-label="Demo"
        batchSize={10}
        onAction={(data: DemoCharacter) => console.log(data)}
      >
        <ListLoaderAsync loader={loadCharacters} />

        <ListFilter property="faction" name="Faction" mode="some" />
        <ListFilter
          property="homeworld"
          name="Homeworld"
          mode="some"
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

        {/* An href makes the host render a real anchor, so middle-click and
            the browser's own context menu work on an item. */}
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

        <ListTableColumn>Name</ListTableColumn>
        <ListTableCell>
          {{ default: ({ data }: { data: DemoCharacter }) => data.name }}
        </ListTableCell>
      </List>
    </Section>
  ),
});
