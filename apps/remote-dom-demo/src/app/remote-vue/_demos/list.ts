import { demoData, type DemoCharacter } from "@/app/remote/list/demoData";
import {
  Avatar,
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
  Section,
  Text,
} from "@mittwald/flow-remote-vue-components";
import { defineComponent, h } from "vue";

/**
 * The `list` demo as a Vue remote app — the counterpart of
 * `src/app/remote/list/page.tsx`.
 *
 * Deliberately the same list: an async loader that takes its time, a filter, a
 * search, tiles, a table view and a context menu per item. What it leaves out
 * is the React page's per-item modal, which opens from inside a context menu —
 * a pattern the corpus harness lists as unsupported on both sides.
 */
const loadCharacters = () =>
  new Promise<{ data: DemoCharacter[]; itemTotalCount: number }>((resolve) => {
    setTimeout(
      () => resolve({ data: demoData, itemTotalCount: demoData.length }),
      1500,
    );
  });

export const ListDemo = defineComponent({
  name: "ListDemo",

  setup: () => () =>
    h(Section, null, () =>
      h(
        List,
        {
          "aria-label": "Demo",
          batchSize: 10,
          getItemId: (data: DemoCharacter) => data.id,
          onAction: (data: DemoCharacter) => console.log(data),
          settingStorageKey: "vue-demo-list",
        },
        () => [
          h(ListLoaderAsync, { loader: loadCharacters }),

          h(ListFilter, {
            property: "faction",
            name: "Faction",
            mode: "some",
          }),
          h(ListFilter, {
            property: "homeworld",
            name: "Homeworld",
            mode: "some",
            priority: "secondary",
          }),
          h(ListSearch),
          h(ListSorting, { property: "name", name: "Name", direction: "asc" }),
          h(ListSorting, {
            property: "name",
            name: "Name",
            direction: "desc",
            directionName: "descending",
          }),

          h(
            ListItem,
            {
              textValue: (data: DemoCharacter) => data.name,
              /* An href makes the host render a real anchor, so middle-click
                 and the browser's own context menu work on an item. */
              href: (data: DemoCharacter) => `#${data.name}`,
              showTiles: true,
            },
            {
              default: ({ data }: { data: DemoCharacter }) =>
                h(ListItemView, null, () => [
                  h(Avatar, null, () => h(IconEmail)),
                  h(Heading, null, () => `${data.name} (${data.faction})`),
                  h(Text, null, () => data.bio.slice(0, 100)),
                  h(ContextMenu, null, () =>
                    h(MenuItem, { onAction: () => console.log(data) }, () => [
                      h(IconEmail),
                      h(Text, null, () => "Send message"),
                    ]),
                  ),
                ]),
            },
          ),

          h(ListTableColumn, null, () => "Name"),
          h(ListTableColumn, null, () => "Faction"),
          h(ListTableCell, null, {
            default: ({ data }: { data: DemoCharacter }) => data.name,
          }),
          h(ListTableCell, null, {
            default: ({ data }: { data: DemoCharacter }) => data.faction,
          }),
        ],
      ),
    ),
});
