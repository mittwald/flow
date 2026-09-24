import { testParity, type ParityScenario } from "./harness";
import {
  Avatar as ReactAvatar,
  Button as ReactButton,
  Content as ReactContent,
  ContextMenu as ReactContextMenu,
  Heading as ReactHeading,
  Initials as ReactInitials,
  ListItemView as ReactListItemView,
  ListSummary as ReactListSummary,
  MenuItem as ReactMenuItem,
  Text as ReactText,
  typedList,
} from "@mittwald/flow-remote-react-components";
import {
  Avatar,
  Button,
  Content,
  ContextMenu,
  Heading,
  Initials,
  List,
  ListFilter,
  ListItem,
  ListItemView,
  ListLoaderAsync,
  ListSearch,
  ListSorting,
  ListStaticData,
  ListSummary,
  ListTableCell,
  ListTableColumn,
  MenuItem,
  Text,
} from "@mittwald/flow-remote-vue-components";
import { page, userEvent } from "vitest/browser";
import { h } from "vue";

interface Crew {
  id: string;
  name: string;
  rank: string;
  joined: string;
}

const crew: Crew[] = [
  {
    id: "1",
    name: "Ellen Ripley",
    rank: "Warrant Officer",
    joined: "2024-03-05",
  },
  { id: "2", name: "Dwayne Hicks", rank: "Corporal", joined: "2024-06-11" },
  { id: "3", name: "Carter Burke", rank: "Company Man", joined: "2024-09-27" },
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

/** A loader that never answers, so the list stays in its loading state. */
const neverAnswers = () => new Promise<never>(() => undefined);

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
    /*
     * The loading state is a tree of its own: placeholder items in the shape
     * of a real one. A loader that never answers holds it still.
     */
    name: "items that are still loading",
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId} loadingItemsCount={3}>
          <L.LoaderAsync>{neverAnswers}</L.LoaderAsync>
          {reactItem}
        </L.List>
      ),
      vue: () =>
        h(
          List,
          { "aria-label": "Crew", getItemId, loadingItemsCount: 3 },
          () => [h(ListLoaderAsync, { loader: neverAnswers }), vueItem()],
        ),
    },
  },

  {
    /*
     * A bare `ContextMenu` in an item is not rendered as written: the item
     * view gives it the button that opens it. React does that with a props
     * context (`wrapWith`), Vue by rewriting the routed child — and a binding
     * that forgets it ships a menu nobody can reach.
     *
     * One item, so the options button is unambiguous to click.
     */
    name: "an item with a context menu",
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId}>
          <L.StaticData data={crew.slice(0, 1)} />
          <L.Item textValue={textValue}>
            {(data) => (
              <ReactListItemView>
                <ReactHeading>{data.name}</ReactHeading>
                <ReactContextMenu>
                  <ReactMenuItem>Show details</ReactMenuItem>
                  <ReactMenuItem>Delete</ReactMenuItem>
                </ReactContextMenu>
              </ReactListItemView>
            )}
          </L.Item>
        </L.List>
      ),
      vue: () =>
        h(List, { "aria-label": "Crew", getItemId }, () => [
          h(ListStaticData, { data: crew.slice(0, 1) }),
          h(
            ListItem,
            { textValue },
            {
              default: ({ data }: { data: Crew }) =>
                h(ListItemView, null, () => [
                  h(Heading, null, () => data.name),
                  h(ContextMenu, null, () => [
                    h(MenuItem, null, () => "Show details"),
                    h(MenuItem, null, () => "Delete"),
                  ]),
                ]),
            },
          ),
        ]),
    },
    interact: openMenu("Options"),
  },

  {
    /*
     * Selection belongs to the host's grid list — both bindings only hand the
     * props through, and the checkboxes it draws are the proof that they did.
     */
    name: "items that can be selected",
    trees: {
      react: () => (
        <L.List
          aria-label="Crew"
          getItemId={getItemId}
          selectionMode="multiple"
          defaultSelectedKeys={["2"]}
        >
          <L.StaticData data={crew} />
          {reactItem}
        </L.List>
      ),
      vue: () =>
        h(
          List,
          {
            "aria-label": "Crew",
            getItemId,
            selectionMode: "multiple",
            defaultSelectedKeys: ["2"],
          },
          () => [h(ListStaticData, { data: crew }), vueItem()],
        ),
    },
  },

  {
    /*
     * Expandable items: the toggle in the item's button slot, and the bottom
     * content only in the tree while it is open.
     */
    name: "an accordion item, expanded",
    interact: async () => {
      await userEvent.click(
        page.getByRole("button", { name: "Show more" }).first(),
      );
    },
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId} accordion>
          <L.StaticData data={crew} />
          <L.Item textValue={textValue}>
            {(data) => (
              <ReactListItemView>
                <ReactHeading>{data.name}</ReactHeading>
                <ReactContent slot="bottom">
                  <ReactText>{data.rank}</ReactText>
                </ReactContent>
              </ReactListItemView>
            )}
          </L.Item>
        </L.List>
      ),
      vue: () =>
        h(List, { "aria-label": "Crew", getItemId, accordion: true }, () => [
          h(ListStaticData, { data: crew }),
          h(
            ListItem,
            { textValue },
            {
              default: ({ data }: { data: Crew }) =>
                h(ListItemView, null, () => [
                  h(Heading, null, () => data.name),
                  h(Content, { slot: "bottom" }, () =>
                    h(Text, null, () => data.rank),
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
    /*
     * A date range is a calendar in a popover rather than a menu of values —
     * a different control on both sides, over the same shared filter.
     */
    name: "a date-range filter, opened",
    interact: openMenu("Joined"),
    trees: {
      react: () => (
        <L.List aria-label="Crew" getItemId={getItemId}>
          <L.StaticData data={crew} />
          {reactItem}
          <L.Filter property="joined" mode="dateRange" name="Joined" />
        </L.List>
      ),
      vue: () =>
        h(List, { "aria-label": "Crew", getItemId }, () => [
          h(ListStaticData, { data: crew }),
          vueItem(),
          h(ListFilter, {
            property: "joined",
            mode: "dateRange",
            name: "Joined",
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
  "flow--list--list-item-view--checkbox-container",
  "flow--list--items--tiles",
  "flow--list--items--empty-view",
  "flow--list--list-item-view--view",
  "flow--list--list-item-view--title",
  "flow--list--list-item-view--sub-title",
  "flow--list--list-item-view--action",
  "flow--skeleton",
  "flow--list--table",
  "flow--list--table--row",
  "flow--list--footer",

  /* The components it composes. */
  "flow--accordion",
  "flow--calendar--range",
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
