import {
  Heading,
  List,
  ListFilter,
  ListItem,
  ListItemView,
  ListLoaderAsync,
  ListSearch,
  ListSorting,
  ListStaticData,
  SettingsProvider,
  Text,
} from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { page, userEvent } from "vitest/browser";
import { afterEach, describe, expect, test } from "vitest";
import { defineComponent, h } from "vue";

afterEach(() => cleanupRemote());

interface Crew {
  name: string;
  rank: string;
}

const crew: Crew[] = [
  { name: "Ellen Ripley", rank: "Warrant Officer" },
  { name: "Dwayne Hicks", rank: "Corporal" },
  { name: "Carter Burke", rank: "Company Man" },
];

/*
 * Scoped to the host's own container: the remote tree is mirrored into the same
 * document, so an unscoped text query matches the `flr-*` element too and
 * vitest's strict mode fails on the pair.
 */
const renderList = (children: () => unknown, listProps = {}) => {
  const { host } = renderRemote(
    defineComponent(
      () => () =>
        h(List, { "aria-label": "Crew", ...listProps }, { default: children }),
    ),
  );

  return page.elementLocator(host);
};

const staticCrewList = (extra: unknown[] = []) =>
  renderList(() => [
    h(ListStaticData, { data: crew }),
    h(
      ListItem,
      { textValue: (data: Crew) => data.name },
      {
        default: ({ data }: { data: Crew }) =>
          h(ListItemView, null, () => [
            h(Heading, null, () => data.name),
            h(Text, null, () => data.rank),
          ]),
      },
    ),
    ...extra,
  ]);

describe("Static data", () => {
  test("renders one item per entry", async () => {
    const list = staticCrewList();

    await expect.element(list.getByText("Ellen Ripley")).toBeVisible();
    await expect.element(list.getByText("Dwayne Hicks")).toBeVisible();
  });

  /*
   * The item's children reach the host as the list item's slots — a `Heading`
   * becomes the title, a `Text` the subtitle. Flow's React list routes them
   * with tunnels; here it is the routing in `ListItemView`, and the host has to
   * end up with the same thing either way.
   *
   * Queried by text, not by role: inside a list item Flow renders a `Heading`
   * as a `<span>` with a `level`, so there is no heading role to find.
   */
  test("routes an item's heading and text into the item's slots", async () => {
    const list = staticCrewList();

    await expect.element(list.getByText("Warrant Officer")).toBeVisible();
  });

  test("counts the items in the footer", async () => {
    const list = staticCrewList();

    await expect.element(list.getByText("Showing 3 of 3")).toBeVisible();
  });
});

describe("Paging", () => {
  test("shows one batch and loads the next on demand", async () => {
    const list = renderList(
      () => [
        h(ListStaticData, { data: crew }),
        h(
          ListItem,
          { textValue: (data: Crew) => data.name },
          {
            default: ({ data }: { data: Crew }) =>
              h(ListItemView, null, () => h(Heading, null, () => data.name)),
          },
        ),
      ],
      { batchSize: 2 },
    );

    await expect.element(list.getByText("Showing 2 of 3")).toBeVisible();
    expect(list.getByText("Carter Burke").query()).toBeNull();

    await userEvent.click(list.getByRole("button", { name: "Show more" }));

    await expect.element(list.getByText("Carter Burke")).toBeVisible();
  });
});

describe("Sorting", () => {
  test("sorts by the property the menu names", async () => {
    const list = staticCrewList([
      h(ListSorting, { property: "name", name: "Name", direction: "asc" }),
    ]);

    await userEvent.click(list.getByRole("button", { name: "Sorting" }));
    await userEvent.click(page.getByRole("menuitemradio", { name: "Name" }));

    await expect
      .poll(() =>
        list.getByRole("row").elements()[0]?.getAttribute("aria-label"),
      )
      .toBe("Carter Burke");
  });
});

describe("Filtering", () => {
  test("keeps only the items the selected value matches", async () => {
    const list = staticCrewList([
      h(ListFilter, { property: "rank", mode: "one", name: "Rank" }),
    ]);

    await userEvent.click(list.getByRole("button", { name: "Rank" }));
    await userEvent.click(
      page.getByRole("menuitemradio", { name: "Corporal" }),
    );

    await expect.poll(() => list.getByRole("row").elements().length).toBe(1);
    await expect.element(list.getByText("Dwayne Hicks")).toBeVisible();
    expect(list.getByText("Ellen Ripley").query()).toBeNull();
  });
});

describe("Searching", () => {
  test("filters by the search term", async () => {
    const list = staticCrewList([h(ListSearch)]);

    await userEvent.fill(list.getByRole("searchbox"), "Ripley");

    await expect.element(list.getByText("Ellen Ripley")).toBeVisible();
    await expect
      .element(list.getByText("Dwayne Hicks"))
      .not.toBeInTheDocument();
  });
});

describe("Persisted view settings", () => {
  const backend = () => {
    const values = new Map<string, string>();
    return {
      values,
      get: (key: string) => values.get(key) ?? null,
      set: (key: string, value: string) => void values.set(key, value),
    };
  };

  /*
   * Under the same keys React writes, so the two bindings read each other's
   * values — a user who opens the same list in a Vue extension and in the
   * backoffice sees one set of view settings, not two.
   */
  test("writes the sorting the user picked", async () => {
    const store = backend();

    const { host } = renderRemote(
      defineComponent(
        () => () =>
          h(SettingsProvider, { backend: store, prefix: "test" }, () =>
            h(List, { "aria-label": "Crew", settingStorageKey: "crew" }, () => [
              h(ListStaticData, { data: crew }),
              h(
                ListItem,
                { textValue: (data: Crew) => data.name },
                {
                  default: ({ data }: { data: Crew }) =>
                    h(ListItemView, null, () =>
                      h(Heading, null, () => data.name),
                    ),
                },
              ),
              h(ListSorting, {
                property: "name",
                name: "Name",
                direction: "asc",
              }),
            ]),
          ),
      ),
    );

    const list = page.elementLocator(host);
    await userEvent.click(list.getByRole("button", { name: "Sorting" }));
    await userEvent.click(page.getByRole("menuitemradio", { name: "Name" }));

    await expect
      .poll(() => store.values.get("test.List.crew.sorting.autosave"))
      .toBe(JSON.stringify({ property: "name", direction: "asc" }));
  });

  test("restores it on the next render", async () => {
    const store = backend();
    store.values.set(
      "test.List.crew.sorting.autosave",
      JSON.stringify({ property: "name", direction: "asc" }),
    );

    const { host } = renderRemote(
      defineComponent(
        () => () =>
          h(SettingsProvider, { backend: store, prefix: "test" }, () =>
            h(List, { "aria-label": "Crew", settingStorageKey: "crew" }, () => [
              h(ListStaticData, { data: crew }),
              h(
                ListItem,
                { textValue: (data: Crew) => data.name },
                {
                  default: ({ data }: { data: Crew }) =>
                    h(ListItemView, null, () =>
                      h(Heading, null, () => data.name),
                    ),
                },
              ),
              h(ListSorting, {
                property: "name",
                name: "Name",
                direction: "asc",
              }),
            ]),
          ),
      ),
    );

    const list = page.elementLocator(host);

    await expect
      .poll(() =>
        list.getByRole("row").elements()[0]?.getAttribute("aria-label"),
      )
      .toBe("Carter Burke");
  });
});

describe("An async loader", () => {
  test("is asked for a page and reports the total", async () => {
    const list = renderList(
      () => [
        h(ListLoaderAsync, {
          manualPagination: true,
          loader: (options: { pagination?: { offset: number } }) =>
            Promise.resolve({
              data: crew.slice(
                options.pagination?.offset ?? 0,
                (options.pagination?.offset ?? 0) + 2,
              ),
              itemTotalCount: crew.length,
            }),
        }),
        h(
          ListItem,
          { textValue: (data: Crew) => data.name },
          {
            default: ({ data }: { data: Crew }) =>
              h(ListItemView, null, () => h(Heading, null, () => data.name)),
          },
        ),
      ],
      { batchSize: 2 },
    );

    await expect.element(list.getByText("Showing 2 of 3")).toBeVisible();
  });
});
