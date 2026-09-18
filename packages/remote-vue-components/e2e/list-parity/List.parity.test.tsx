import { testParity, type ParityScenario } from "./harness";
import {
  Avatar as ReactAvatar,
  Button as ReactButton,
  Content as ReactContent,
  Heading as ReactHeading,
  Initials as ReactInitials,
  ListItemView as ReactListItemView,
  ListSummary as ReactListSummary,
  Text as ReactText,
  typedList,
} from "@mittwald/flow-remote-react-components";
import {
  Avatar,
  Button,
  Content,
  Heading,
  Initials,
  List,
  ListFilter,
  ListItem,
  ListItemView,
  ListSearch,
  ListSorting,
  ListStaticData,
  ListSummary,
  ListTableCell,
  ListTableColumn,
  Text,
} from "@mittwald/flow-remote-vue-components";
import { page, userEvent } from "vitest/browser";
import { h } from "vue";

interface Crew {
  id: string;
  name: string;
  rank: string;
}

const crew: Crew[] = [
  { id: "1", name: "Ellen Ripley", rank: "Warrant Officer" },
  { id: "2", name: "Dwayne Hicks", rank: "Corporal" },
  { id: "3", name: "Carter Burke", rank: "Company Man" },
];

const getItemId = (data: Crew) => data.id;
const textValue = (data: Crew) => data.name;

const L = typedList<Crew>();

/* The plain item both sides reuse where the item itself is not the subject. */
const reactItem = (
  <L.Item textValue={textValue}>
    {(data) => (
      <ReactListItemView>
        <ReactHeading>{data.name}</ReactHeading>
        <ReactText>{data.rank}</ReactText>
      </ReactListItemView>
    )}
  </L.Item>
);

const vueItem = () =>
  h(
    ListItem,
    { textValue },
    {
      default: ({ data }: { data: Crew }) =>
        h(ListItemView, null, () => [
          h(Heading, null, () => data.name),
          h(Text, null, () => data.rank),
        ]),
    },
  );

const openMenu = (name: string) => async () => {
  await userEvent.click(page.getByRole("button", { name }));
};

const scenarios: ParityScenario[] = [
  {
    name: "items in list view",
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId}>
          <L.StaticData data={crew} />
          {reactItem}
        </L.List>
      ),
      vue: () =>
        h(List, { "aria-label": "Crew", getItemId }, () => [
          h(ListStaticData, { data: crew }),
          vueItem(),
        ]),
    },
  },

  {
    /* Every slot of `ListItemViewContent`: React routes them with tunnels, Vue
     * by component type — the host has to end up with the same tree. */
    name: "an item with an avatar, a button and expandable content",
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId}>
          <L.StaticData data={crew} />
          <L.Item textValue={textValue}>
            {(data) => (
              <ReactListItemView>
                <ReactAvatar>
                  <ReactInitials>{data.name}</ReactInitials>
                </ReactAvatar>
                <ReactHeading>{data.name}</ReactHeading>
                <ReactText>{data.rank}</ReactText>
                <ReactButton>Assign</ReactButton>
                <ReactContent slot="bottom">
                  <ReactText>Aboard the Sulaco</ReactText>
                </ReactContent>
              </ReactListItemView>
            )}
          </L.Item>
        </L.List>
      ),
      vue: () =>
        h(List, { "aria-label": "Crew", getItemId }, () => [
          h(ListStaticData, { data: crew }),
          h(
            ListItem,
            { textValue },
            {
              default: ({ data }: { data: Crew }) =>
                h(ListItemView, null, () => [
                  h(Avatar, null, () => h(Initials, null, () => data.name)),
                  h(Heading, null, () => data.name),
                  h(Text, null, () => data.rank),
                  h(Button, null, () => "Assign"),
                  h(Content, { slot: "bottom" }, () =>
                    h(Text, null, () => "Aboard the Sulaco"),
                  ),
                ]),
            },
          ),
        ]),
    },
  },

  {
    name: "items in tiles view",
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId} defaultViewMode="tiles">
          <L.StaticData data={crew} />
          <L.Item textValue={textValue} showTiles>
            {(data) => (
              <ReactListItemView>
                <ReactHeading>{data.name}</ReactHeading>
              </ReactListItemView>
            )}
          </L.Item>
        </L.List>
      ),
      vue: () =>
        h(
          List,
          { "aria-label": "Crew", getItemId, defaultViewMode: "tiles" },
          () => [
            h(ListStaticData, { data: crew }),
            h(
              ListItem,
              { textValue, showTiles: true },
              {
                default: ({ data }: { data: Crew }) =>
                  h(ListItemView, null, () =>
                    h(Heading, null, () => data.name),
                  ),
              },
            ),
          ],
        ),
    },
  },

  {
    name: "the view-mode menu, opened",
    interact: openMenu("Settings"),
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId}>
          <L.StaticData data={crew} />
          <L.Item textValue={textValue} showTiles>
            {(data) => (
              <ReactListItemView>
                <ReactHeading>{data.name}</ReactHeading>
              </ReactListItemView>
            )}
          </L.Item>
        </L.List>
      ),
      vue: () =>
        h(List, { "aria-label": "Crew", getItemId }, () => [
          h(ListStaticData, { data: crew }),
          h(
            ListItem,
            { textValue, showTiles: true },
            {
              default: ({ data }: { data: Crew }) =>
                h(ListItemView, null, () => h(Heading, null, () => data.name)),
            },
          ),
        ]),
    },
  },

  {
    name: "sorting, applied from its menu",
    interact: async () => {
      await userEvent.click(page.getByRole("button", { name: "Sorting" }));
      await userEvent.click(page.getByRole("menuitemradio", { name: "Name" }));
    },
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId}>
          <L.StaticData data={crew} />
          {reactItem}
          <L.Sorting property="name" name="Name" direction="asc" />
        </L.List>
      ),
      vue: () =>
        h(List, { "aria-label": "Crew", getItemId }, () => [
          h(ListStaticData, { data: crew }),
          vueItem(),
          h(ListSorting, { property: "name", name: "Name", direction: "asc" }),
        ]),
    },
  },

  {
    /* Also the active-filter chips: a selection is what makes them appear. */
    name: "a filter, applied from its menu",
    interact: async () => {
      await userEvent.click(page.getByRole("button", { name: "Rank" }));
      await userEvent.click(
        page.getByRole("menuitemcheckbox", { name: "Corporal" }),
      );
      await userEvent.keyboard("{Escape}");
    },
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId}>
          <L.StaticData data={crew} />
          {reactItem}
          <L.Filter property="rank" mode="some" name="Rank" />
        </L.List>
      ),
      vue: () =>
        h(List, { "aria-label": "Crew", getItemId }, () => [
          h(ListStaticData, { data: crew }),
          vueItem(),
          h(ListFilter, { property: "rank", mode: "some", name: "Rank" }),
        ]),
    },
  },

  {
    name: "a search that matches nothing",
    interact: async () => {
      await userEvent.fill(page.getByRole("searchbox"), "Bishop");
    },
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId}>
          <L.StaticData data={crew} />
          {reactItem}
          <L.Search />
        </L.List>
      ),
      vue: () =>
        h(List, { "aria-label": "Crew", getItemId }, () => [
          h(ListStaticData, { data: crew }),
          vueItem(),
          h(ListSearch),
        ]),
    },
  },

  {
    name: "the next batch, loaded on demand",
    interact: async () => {
      await userEvent.click(page.getByRole("button", { name: "Show more" }));
    },
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId} batchSize={2}>
          <L.StaticData data={crew} />
          {reactItem}
        </L.List>
      ),
      vue: () =>
        h(List, { "aria-label": "Crew", getItemId, batchSize: 2 }, () => [
          h(ListStaticData, { data: crew }),
          vueItem(),
        ]),
    },
  },

  {
    name: "a list with nothing in it",
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId}>
          <L.StaticData data={[]} />
          {reactItem}
        </L.List>
      ),
      vue: () =>
        h(List, { "aria-label": "Crew", getItemId }, () => [
          h(ListStaticData, { data: [] }),
          vueItem(),
        ]),
    },
  },

  {
    name: "the table view mode",
    interact: async () => {
      await userEvent.click(page.getByRole("button", { name: "Settings" }));
      await userEvent.click(page.getByRole("menuitemradio", { name: "Table" }));
    },
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId}>
          <L.StaticData data={crew} />
          {reactItem}
          <L.TableColumn>Name</L.TableColumn>
          <L.TableColumn>Rank</L.TableColumn>
          <L.TableCell>{(data) => data.name}</L.TableCell>
          <L.TableCell>{(data) => data.rank}</L.TableCell>
        </L.List>
      ),
      vue: () =>
        h(List, { "aria-label": "Crew", getItemId }, () => [
          h(ListStaticData, { data: crew }),
          vueItem(),
          h(ListTableColumn, null, () => "Name"),
          h(ListTableColumn, null, () => "Rank"),
          h(ListTableCell, null, {
            default: ({ data }: { data: Crew }) => data.name,
          }),
          h(ListTableCell, null, {
            default: ({ data }: { data: Crew }) => data.rank,
          }),
        ]),
    },
  },

  {
    /* A secondary filter is what puts the modal on desktop, and keeps the
     * filter out of the header — both rules have to hold on both sides. */
    name: "the all-filters modal, opened",
    interact: openMenu("All filters"),
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId}>
          <L.StaticData data={crew} />
          {reactItem}
          <L.Filter
            property="rank"
            mode="some"
            name="Rank"
            priority="secondary"
          />
          <L.Sorting property="name" name="Name" direction="asc" />
        </L.List>
      ),
      vue: () =>
        h(List, { "aria-label": "Crew", getItemId }, () => [
          h(ListStaticData, { data: crew }),
          vueItem(),
          h(ListFilter, {
            property: "rank",
            mode: "some",
            name: "Rank",
            priority: "secondary",
          }),
          h(ListSorting, { property: "name", name: "Name", direction: "asc" }),
        ]),
    },
  },

  {
    name: "a list summary above the items",
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId}>
          <L.StaticData data={crew} />
          {reactItem}
          <ReactListSummary>
            <ReactText>Three aboard</ReactText>
          </ReactListSummary>
        </L.List>
      ),
      vue: () =>
        h(
          List,
          { "aria-label": "Crew", getItemId },
          {
            default: () => [h(ListStaticData, { data: crew }), vueItem()],
            summary: () =>
              h(ListSummary, null, () => h(Text, null, () => "Three aboard")),
          },
        ),
    },
  },
];

/*
 * What the scenarios above have to have reached: the List's own parts, and the
 * Flow components it composes. A component that stops appearing is a scenario
 * that stopped covering it — which a suite of passing comparisons cannot say.
 */
const coverage = [
  /* The List's own structure. */
  "flow--list",
  "flow--list--header",
  "flow--list--header--header-content",
  "flow--list--header--options",
  "flow--list--header--active-filters",
  "flow--list--header--hide-visually-actions",
  "flow--list--header--search-field",
  "flow--list--list-wrapper",
  "flow--list--hide-visually-empty-view",
  "flow--list--items",
  "flow--list--items--item",
  "flow--list--items--tiles",
  "flow--list--items--empty-view",
  "flow--list--list-item-view--view",
  "flow--list--list-item-view--title",
  "flow--list--list-item-view--sub-title",
  "flow--list--table",
  "flow--list--table--row",
  "flow--list--footer",

  /* The components it composes. */
  "flow--accordion",
  "flow--avatar",
  "flow--badge",
  "flow--button",
  "flow--checkbox",
  "flow--context-menu",
  "flow--heading",
  "flow--icon",
  "flow--illustrated-message",
  "flow--initials",
  "flow--list--list-summary",
  "flow--modal",
  "flow--radio",
  "flow--search-field",
  "flow--table",
  "flow--text",
];

testParity("The List, rendered by every binding", scenarios, coverage);
