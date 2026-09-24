import {
  Content,
  Heading,
  List,
  ListFilter,
  ListItem,
  ListItemView,
  ListLoaderAsync,
  ListLoaderComposable,
  ListSearch,
  ListSorting,
  ListStaticData,
  ListTableCell,
  ListTableColumn,
  SettingsProvider,
  Text,
  useListMetadata,
  type SettingsBackend,
  type SettingsJson,
} from "@/index";
import { cleanupRemote, renderRemote } from "@/tests/lib/environment";
import { page, userEvent } from "vitest/browser";
import { afterEach, describe, expect, test, vi } from "vitest";
import {
  computed,
  defineComponent,
  h,
  onErrorCaptured,
  ref,
  watchEffect,
} from "vue";

afterEach(() => cleanupRemote());

interface Crew {
  name: string;
  rank: string;
  joined: string;
}

const crew: Crew[] = [
  { name: "Ellen Ripley", rank: "Warrant Officer", joined: "2026-09-10" },
  { name: "Dwayne Hicks", rank: "Corporal", joined: "2026-09-20" },
  { name: "Carter Burke", rank: "Company Man", joined: "2026-10-05" },
];

/*
 * Scoped to the host's own container: the remote tree is mirrored into the same
 * document, so an unscoped text query matches the `flr-*` element too and
 * vitest's strict mode fails on the pair.
 *
 * By test id, not `hostLocator(host)`: that locator is positional
 * (`div:first`), and react-aria's live announcer, prepended to the body on the
 * first announcement, takes the position over.
 */
const hostLocator = (host: HTMLElement) => {
  host.dataset.testid = "remote-host";
  return page.getByTestId("remote-host");
};

const renderList = (children: () => unknown, listProps = {}) => {
  const { host } = renderRemote(
    defineComponent(
      () => () =>
        h(List, { "aria-label": "Crew", ...listProps }, { default: children }),
    ),
  );

  return hostLocator(host);
};

/*
 * `extra` is a factory, not an array: a vnode belongs to one render, and Vue
 * re-renders the list several times. Reusing the same nodes works until it
 * does not — a date filter built that way lost its popover between the two
 * clicks a range takes, and later tests died on a half-mounted node.
 */
const staticCrewList = (extra: () => unknown[] = () => []) =>
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
    ...extra(),
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

  /*
   * A consumer writes the array inline, so every render builds a new one. On
   * identity that reads as "the data changed", and the reset that follows
   * re-renders the list, which builds the array again — Vue reports the loop as
   * "Maximum recursive updates exceeded in component <List>", and the list
   * renders nothing at all.
   */
  test("survives a data array that is rebuilt on every render", async () => {
    const list = renderList(() => [
      h(ListStaticData, { data: [...crew] }),
      h(
        ListItem,
        { textValue: (data: Crew) => data.name },
        {
          default: ({ data }: { data: Crew }) =>
            h(ListItemView, null, () => h(Heading, null, () => data.name)),
        },
      ),
    ]);

    await expect.element(list.getByText("Ellen Ripley")).toBeVisible();
    await expect.poll(() => list.getByRole("row").elements().length).toBe(3);
  });

  test("counts the items in the footer", async () => {
    const list = staticCrewList();

    await expect.element(list.getByText("Showing 3 of 3")).toBeVisible();
  });
});

/*
 * A template keeps the keys as written — `text-value`, `manual-pagination` —
 * and a bare attribute arrives as `""`. The list reads its setup elements'
 * props itself, so it has to normalize both the way Vue does for declared
 * props.
 */
describe("Setup props written as a template writes them", () => {
  test("reads kebab-case keys", async () => {
    const list = renderList(() => [
      h(ListStaticData, { data: crew }),
      h(ListFilter, {
        property: "rank",
        mode: "some",
        name: "Rank",
        "default-selected": ["Corporal"],
      }),
      h(
        ListItem,
        { "text-value": (data: Crew) => `Crew member ${data.name}` },
        {
          default: ({ data }: { data: Crew }) =>
            h(ListItemView, null, () => h(Heading, null, () => data.name)),
        },
      ),
    ]);

    await expect.poll(() => list.getByRole("row").elements().length).toBe(1);
    expect(list.getByRole("row").element().getAttribute("aria-label")).toBe(
      "Crew member Dwayne Hicks",
    );
  });

  test("reads a bare boolean attribute as true", async () => {
    const received: unknown[] = [];

    const list = renderList(
      () => [
        h(ListLoaderAsync, {
          "manual-pagination": "",
          loader: (options: { pagination?: unknown }) => {
            received.push(options.pagination);
            return Promise.resolve({
              data: crew.slice(0, 2),
              itemTotalCount: 3,
            });
          },
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
    expect(received[0]).toEqual({ limit: 2, offset: 0 });
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
    const list = staticCrewList(() => [
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
    const list = staticCrewList(() => [
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
    const list = staticCrewList(() => [h(ListSearch)]);

    await userEvent.fill(list.getByRole("searchbox"), "Ripley");

    await expect.element(list.getByText("Ellen Ripley")).toBeVisible();
    await expect
      .element(list.getByText("Dwayne Hicks"))
      .not.toBeInTheDocument();
  });
});

describe("Searching without autoSubmit", () => {
  /* React's `autoSubmit={false}`: nothing on a pause, the search on Enter. */
  test("searches on Enter only", async () => {
    const list = staticCrewList(() => [
      h(ListSearch, { "auto-submit": false }),
    ]);
    const searchbox = list.getByRole("searchbox");

    await userEvent.fill(searchbox, "Ripley");
    await new Promise((resolve) => setTimeout(resolve, 800));
    expect(list.getByRole("row").elements()).toHaveLength(3);

    await userEvent.type(searchbox, "{Enter}");

    await expect.poll(() => list.getByRole("row").elements().length).toBe(1);
  });

  test("clears on Escape", async () => {
    const list = staticCrewList(() => [h(ListSearch)]);
    const searchbox = list.getByRole("searchbox");

    await userEvent.fill(searchbox, "Ripley");
    await expect.poll(() => list.getByRole("row").elements().length).toBe(1);

    await userEvent.type(searchbox, "{Escape}");

    await expect.poll(() => list.getByRole("row").elements().length).toBe(3);
    await expect.element(searchbox).toHaveValue("");
  });
});

describe("Active filters", () => {
  const filteredList = () =>
    staticCrewList(() => [
      h(ListFilter, { property: "rank", mode: "some", name: "Rank" }),
    ]);

  const selectRank = async (
    list: ReturnType<typeof staticCrewList>,
    rank: string,
  ) => {
    await userEvent.click(list.getByRole("button", { name: "Rank" }));
    await userEvent.click(page.getByRole("menuitemcheckbox", { name: rank }));
    await userEvent.keyboard("{Escape}");
  };

  test("shows a chip per selected value, and taking one back restores its items", async () => {
    const list = filteredList();

    await selectRank(list, "Corporal");
    await expect.poll(() => list.getByRole("row").elements().length).toBe(1);

    /*
     * By its close button: the chip's own text is the value, which the matching
     * item shows too, so a text query matches both.
     */
    const chip = list.getByRole("button", { name: "Remove" });
    await expect.element(chip).toBeVisible();

    await userEvent.click(chip);

    await expect.poll(() => list.getByRole("row").elements().length).toBe(3);
  });

  /*
   * The button appears only with more than one chip: with a single one, its
   * own close button already does the job.
   */
  test("offers to clear everything once more than one value is on", async () => {
    const list = filteredList();

    await selectRank(list, "Corporal");
    await expect.poll(() => list.getByRole("row").elements().length).toBe(1);
    expect(
      list.getByRole("button", { name: "Clear filters" }).query(),
    ).toBeNull();

    await selectRank(list, "Company Man");

    await userEvent.click(list.getByRole("button", { name: "Clear filters" }));

    await expect.poll(() => list.getByRole("row").elements().length).toBe(3);
  });
});

describe("A date-range filter", () => {
  /*
   * A calendar in a popover rather than a menu of values.
   *
   * What is asserted here is that the control is the right one and that it is
   * wired to the filter. Picking a range is two clicks on a portalled,
   * freshly positioned grid, and driving that reliably in this harness did not
   * work — the first click is lost often enough to make the test a coin flip.
   * The comparison itself is covered by `dateRange.test.ts` in
   * `components-base`, and that the control matches React's by the
   * `a date-range filter, opened` scenario in `e2e/list-parity`.
   */
  test("offers a calendar instead of a menu of values", async () => {
    const list = staticCrewList(() => [
      h(ListFilter, { property: "joined", mode: "dateRange", name: "Joined" }),
    ]);

    await userEvent.click(list.getByRole("button", { name: "Joined" }));

    await expect
      .element(page.getByRole("button", { name: "Tuesday, September 1, 2026" }))
      .toBeVisible();
    expect(page.getByRole("menuitemcheckbox").query()).toBeNull();
  });

  test.todo(
    "filters by the range two clicks in the calendar pick — the first click on the freshly positioned, portalled grid is lost too often to assert on",
  );
});

describe("Accordion items", () => {
  const accordionList = () =>
    renderList(
      () => [
        h(ListStaticData, { data: crew }),
        h(
          ListItem,
          { textValue: (data: Crew) => data.name },
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
      ],
      { accordion: true },
    );

  test("expands one item, and only that one", async () => {
    const list = accordionList();

    await expect
      .element(list.getByRole("button", { name: "Show more" }).first())
      .toBeVisible();
    expect(list.getByText("Warrant Officer").query()).toBeNull();

    await userEvent.click(
      list.getByRole("button", { name: "Show more" }).first(),
    );

    await expect.element(list.getByText("Warrant Officer")).toBeVisible();
    expect(list.getByText("Corporal").query()).toBeNull();
  });

  /*
   * The toggle has to survive its own press. The slot wrappers are a list of
   * only the slots that have content, so the bottom slot appearing used to
   * shift the button's wrapper by one — Vue matched them by position, the host
   * re-materialised the button, and the focus fell to `<body>`. Keyed wrappers
   * are what keep it.
   */
  test("keeps the focus on the toggle it was pressed on", async () => {
    const list = accordionList();

    const toggle = list.getByRole("button", { name: "Show more" }).first();
    await expect.element(toggle).toBeVisible();
    const node = toggle.element();

    await userEvent.click(toggle);
    await expect
      .element(list.getByRole("button", { name: "Show less" }))
      .toBeVisible();

    expect(document.activeElement).toBe(node);
  });
});

describe("The all-filters modal", () => {
  /*
   * A secondary filter is what puts the modal on desktop: without one, the
   * button carries `hide-on-desktop` as well and the modal is the mobile-only
   * path. The filter therefore also has no menu of its own in the header.
   */
  const secondaryRank = () =>
    h(ListFilter, {
      property: "rank",
      mode: "some",
      name: "Rank",
      priority: "secondary",
    });

  const openModal = async (list: ReturnType<typeof staticCrewList>) => {
    await userEvent.click(list.getByRole("button", { name: "All filters" }));
    return page.getByRole("dialog");
  };

  /*
   * By its label, not by its role: Flow hides the real `<input>` under a
   * `clip: rect(0,0,0,0)` span, and Playwright refuses to click something with
   * no box.
   */
  const pick = async (
    dialog: ReturnType<typeof page.getByRole>,
    label: string,
  ) => userEvent.click(dialog.getByText(label));

  test("carries the filters the header leaves out", async () => {
    const list = staticCrewList(() => [secondaryRank()]);

    await expect.element(list.getByText("Ellen Ripley")).toBeVisible();
    expect(list.getByRole("button", { name: "Rank" }).query()).toBeNull();

    const dialog = await openModal(list);
    await pick(dialog, "Corporal");

    await expect.poll(() => list.getByRole("row").elements().length).toBe(1);
  });

  test("sorts from inside the modal", async () => {
    const list = staticCrewList(() => [
      secondaryRank(),
      h(ListSorting, { property: "name", name: "Name", direction: "asc" }),
    ]);

    const dialog = await openModal(list);
    await pick(dialog, "Name");

    await expect
      .poll(() =>
        list.getByRole("row").elements()[0]?.getAttribute("aria-label"),
      )
      .toBe("Carter Burke");
  });

  test("closes on the button that counts the results", async () => {
    const list = staticCrewList(() => [secondaryRank()]);

    await openModal(list);
    const close = page.getByRole("button", { name: "Show 3 Results" });
    await expect.element(close).toBeVisible();

    await userEvent.click(close);

    await expect.element(close).not.toBeInTheDocument();
  });
});

describe("The table view mode", () => {
  const tableList = () =>
    renderList(() => [
      h(ListStaticData, { data: crew }),
      h(
        ListItem,
        { textValue: (data: Crew) => data.name },
        {
          default: ({ data }: { data: Crew }) =>
            h(ListItemView, null, () => h(Heading, null, () => data.name)),
        },
      ),
      h(ListTableColumn, null, () => "Name"),
      h(ListTableColumn, null, () => "Rank"),
      h(ListTableCell, null, {
        default: ({ data }: { data: Crew }) => data.name,
      }),
      h(ListTableCell, null, {
        default: ({ data }: { data: Crew }) => data.rank,
      }),
    ]);

  /*
   * Declaring columns is what makes the mode available at all — with no table
   * to switch to, the menu has one entry and does not render.
   */
  test("is offered once the list declares columns", async () => {
    const list = tableList();

    await expect
      .element(list.getByRole("button", { name: "Settings" }))
      .toBeVisible();
  });

  test("renders the cells the columns describe", async () => {
    const list = tableList();

    await userEvent.click(list.getByRole("button", { name: "Settings" }));
    await userEvent.click(page.getByRole("menuitemradio", { name: "Table" }));

    await expect.element(list.getByRole("grid")).toBeVisible();
    await expect
      .element(list.getByRole("columnheader", { name: "Rank" }))
      .toBeVisible();
    await expect.element(list.getByText("Corporal")).toBeVisible();
  });
});

describe("Persisted view settings", () => {
  /* `type="custom"`'s store, as React's tests write one. */
  const inMemoryStore = (initial: SettingsJson = {}) => {
    const backend = {
      data: initial,
      load: async () => structuredClone(backend.data),
      store: async (next: SettingsJson) => {
        backend.data = next;
      },
    };
    return backend;
  };

  const crewList = (extra: () => unknown[]) =>
    h(List, { "aria-label": "Crew", settingStorageKey: "crew" }, () => [
      h(ListStaticData, { data: crew }),
      h(
        ListItem,
        { textValue: (data: Crew) => data.name },
        {
          default: ({ data }: { data: Crew }) =>
            h(ListItemView, null, () => h(Heading, null, () => data.name)),
        },
      ),
      ...extra(),
    ]);

  const nameSorting = () =>
    h(ListSorting, { property: "name", name: "Name", direction: "asc" });

  const renderWithProvider = (
    providerProps: {
      type: "custom" | "localStorage";
      storageKey?: string;
      store?: SettingsBackend;
    },
    extra: () => unknown[],
  ) => {
    const { host } = renderRemote(
      defineComponent(
        () => () => h(SettingsProvider, providerProps, () => crewList(extra)),
      ),
    );
    return hostLocator(host);
  };

  const firstRow = (list: ReturnType<typeof hostLocator>) =>
    list.getByRole("row").elements()[0]?.getAttribute("aria-label");

  /*
   * In the shape React's `SettingsProvider` writes, so the two bindings read
   * each other's values: per component, per key, the value JSON-encoded once
   * more.
   */
  test("writes the sorting the user picked", async () => {
    const inMemory = inMemoryStore();
    const list = renderWithProvider({ type: "custom", store: inMemory }, () => [
      nameSorting(),
    ]);

    await userEvent.click(list.getByRole("button", { name: "Sorting" }));
    await userEvent.click(page.getByRole("menuitemradio", { name: "Name" }));

    await expect
      .poll(() => inMemory.data)
      .toEqual({
        List: {
          "crew.sorting.autosave": '{"property":"name","direction":"asc"}',
        },
      });
  });

  /*
   * The second slot: an autosaved selection is what the user currently has, a
   * stored one is what "reset" goes back to. Only the filters have both.
   */
  test("stores the filter selection on demand, in its own slot", async () => {
    const inMemory = inMemoryStore();
    const list = renderWithProvider({ type: "custom", store: inMemory }, () => [
      h(ListFilter, {
        property: "rank",
        mode: "some",
        name: "Rank",
        manualSave: true,
      }),
    ]);

    await userEvent.click(list.getByRole("button", { name: "Rank" }));
    await userEvent.click(
      page.getByRole("menuitemcheckbox", { name: "Corporal" }),
    );
    await userEvent.keyboard("{Escape}");

    await userEvent.click(list.getByRole("button", { name: "Store filters" }));

    await expect
      .poll(() => inMemory.data.List?.["crew.activeFilters"])
      .toContain("rank");
  });

  /*
   * A literal as React writes it into `localStorage` under the provider's
   * `storageKey` (`LocalStorageSettingsBackend`), in the format
   * packages/components' `List.browser.test.tsx` feeds its own list.
   */
  test("restores a sorting React wrote to localStorage", async () => {
    localStorage.setItem(
      "flow-vue-test",
      JSON.stringify({
        List: {
          "crew.sorting.autosave": '{"property":"name","direction":"asc"}',
        },
      }),
    );

    const list = renderWithProvider(
      { type: "localStorage", storageKey: "flow-vue-test" },
      () => [nameSorting()],
    );

    try {
      await expect.poll(() => firstRow(list)).toBe("Carter Burke");
    } finally {
      localStorage.removeItem("flow-vue-test");
    }
  });

  /* React's list persists nothing without a provider; neither does this. */
  test("persists nothing without a provider", async () => {
    const before = { ...localStorage };
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
        nameSorting(),
      ],
      { settingStorageKey: "crew" },
    );

    await userEvent.click(list.getByRole("button", { name: "Sorting" }));
    await userEvent.click(page.getByRole("menuitemradio", { name: "Name" }));
    await expect.poll(() => firstRow(list)).toBe("Carter Burke");

    expect({ ...localStorage }).toEqual(before);
  });

  /* Like React's, the provider reads its backend per `id`. */
  test("loads again when the id changes", async () => {
    const first = inMemoryStore();
    const second = inMemoryStore({
      List: {
        "crew.sorting.autosave": '{"property":"name","direction":"asc"}',
      },
    });
    const id = ref("first");

    const { host } = renderRemote(
      defineComponent(
        () => () =>
          h(
            SettingsProvider,
            {
              type: "custom",
              store: id.value === "first" ? first : second,
              id: id.value,
            },
            () => crewList(() => [nameSorting()]),
          ),
      ),
    );
    const list = hostLocator(host);

    await expect.poll(() => firstRow(list)).toBe("Ellen Ripley");

    id.value = "second";

    await expect.poll(() => firstRow(list)).toBe("Carter Burke");
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
  test("offers the filter values its data brings", async () => {
    /*
     * The filter has no fixed values, so it offers what the data has — and
     * the data is not there when the header first renders.
     */
    const list = renderList(() => [
      h(ListLoaderAsync, {
        loader: () => Promise.resolve({ data: crew, itemTotalCount: 3 }),
      }),
      h(ListFilter, { property: "rank", mode: "some", name: "Rank" }),
      h(
        ListItem,
        { textValue: (data: Crew) => data.name },
        {
          default: ({ data }: { data: Crew }) =>
            h(ListItemView, null, () => h(Heading, null, () => data.name)),
        },
      ),
    ]);

    await expect.element(list.getByText("Ellen Ripley")).toBeVisible();

    await userEvent.click(list.getByRole("button", { name: "Rank" }));

    await expect
      .element(page.getByRole("menuitemcheckbox", { name: "Warrant Officer" }))
      .toBeVisible();
  });
});

describe("An async loader, answering out of order", () => {
  const crewItem = () =>
    h(
      ListItem,
      { textValue: (data: Crew) => data.name },
      {
        default: ({ data }: { data: Crew }) =>
          h(ListItemView, null, () => h(Heading, null, () => data.name)),
      },
    );

  /*
   * A changed search asks again; the first answer arriving after the second
   * belongs to the old query and must not replace what the list shows.
   */
  test("keeps the later request's answer", async () => {
    let releaseSecond: () => void = () => undefined;
    const secondAnswered = new Promise<void>((resolve) => {
      releaseSecond = resolve;
    });
    let calls = 0;

    const list = renderList(() => [
      h(ListLoaderAsync, {
        manualFiltering: true,
        loader: async (options: { searchString?: string }) => {
          calls++;
          if (calls === 2) {
            await secondAnswered;
          }
          const term = (options.searchString ?? "").toLowerCase();
          const data = crew.filter((c) => c.name.toLowerCase().includes(term));
          return { data, itemTotalCount: data.length };
        },
      }),
      h(ListSearch),
      crewItem(),
    ]);

    await expect.poll(() => list.getByRole("row").elements().length).toBe(3);

    await userEvent.fill(list.getByRole("searchbox"), "Hicks");
    await vi.waitFor(() => expect(calls).toBe(2));
    await userEvent.fill(list.getByRole("searchbox"), "Ripley");
    await expect.poll(() => list.getByRole("row").elements().length).toBe(1);
    await expect.element(list.getByText("Ellen Ripley")).toBeVisible();

    releaseSecond();
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(list.getByText("Dwayne Hicks").query()).toBeNull();
    await expect.element(list.getByText("Ellen Ripley")).toBeVisible();
  });

  /*
   * React throws a failed loader into the error boundary. Here it reaches
   * Vue's error handling — `RemoteRoot` reports it to the host — and the batch
   * leaves the loading state instead of showing skeletons forever.
   */
  test("hands a failure to Vue's error handling", async () => {
    const errors: unknown[] = [];

    const { host } = renderRemote(
      defineComponent(() => {
        onErrorCaptured((error) => {
          errors.push(error);
          return false;
        });
        return () =>
          h(List, { "aria-label": "Crew" }, () => [
            h(ListLoaderAsync, {
              loader: async () => {
                await new Promise((resolve) => setTimeout(resolve, 300));
                throw new Error("Comms are down");
              },
            }),
            crewItem(),
          ]);
      }),
    );
    /* A placeholder row is labelled "-". */
    const skeletons = () =>
      host.querySelectorAll('[role=row][aria-label="-"]').length;

    /* The skeletons first, so their disappearing is not the initial state. */
    await vi.waitFor(() => expect(skeletons()).toBeGreaterThan(0));

    await vi.waitFor(() =>
      expect(errors).toEqual([new Error("Comms are down")]),
    );
    await vi.waitFor(() => expect(skeletons()).toBe(0));
  });
});

describe("A composable loader", () => {
  const crewItem = () =>
    h(
      ListItem,
      { textValue: (data: Crew) => data.name },
      {
        default: ({ data }: { data: Crew }) =>
          h(ListItemView, null, () => h(Heading, null, () => data.name)),
      },
    );

  test("loads a batch from its own setup and reports the total", async () => {
    const list = renderList(
      () => [
        h(ListLoaderComposable, {
          manualPagination: true,
          loader: (options: () => { pagination?: { offset: number } }) => {
            /* What a query composable hands back: a ref that fills in later. */
            const result = ref<{ data: Crew[]; itemTotalCount: number }>();
            const offset = options().pagination?.offset ?? 0;

            setTimeout(() => {
              result.value = {
                data: crew.slice(offset, offset + 2),
                itemTotalCount: crew.length,
              };
            }, 10);

            return result;
          },
        }),
        crewItem(),
      ],
      { batchSize: 2 },
    );

    await expect.element(list.getByText("Showing 2 of 3")).toBeVisible();
  });

  test("sees a changed search through the options getter", async () => {
    const list = renderList(() => [
      h(ListLoaderComposable, {
        manualFiltering: true,
        loader: (options: () => { searchString?: string }) =>
          computed(() => {
            const term = (options().searchString ?? "").toLowerCase();
            return {
              data: crew.filter((c) => c.name.toLowerCase().includes(term)),
            };
          }),
      }),
      h(ListSearch),
      crewItem(),
    ]);

    await expect.element(list.getByText("Ellen Ripley")).toBeVisible();

    await userEvent.fill(list.getByRole("searchbox"), "Hicks");

    await expect.element(list.getByText("Dwayne Hicks")).toBeVisible();
    await expect
      .element(list.getByText("Ellen Ripley"))
      .not.toBeInTheDocument();
  });

  /*
   * The shape `USAGE.md` shows: a result ref an async effect fills in. A
   * changed search resets the batch before the new answer is there, so the
   * old one is reported first — and the new one still has to land.
   */
  test("shows what an async composable fetches after a changed search", async () => {
    const list = renderList(() => [
      h(ListLoaderComposable, {
        manualFiltering: true,
        loader: (options: () => { searchString?: string }) => {
          const result = ref<{ data: Crew[] }>();
          watchEffect(async () => {
            const term = (options().searchString ?? "").toLowerCase();
            await new Promise((resolve) => setTimeout(resolve, 100));
            result.value = {
              data: crew.filter((c) => c.name.toLowerCase().includes(term)),
            };
          });
          return result;
        },
      }),
      h(ListSearch),
      crewItem(),
    ]);

    await expect.poll(() => list.getByRole("row").elements().length).toBe(3);

    await userEvent.fill(list.getByRole("searchbox"), "Hicks");

    await expect.poll(() => list.getByRole("row").elements().length).toBe(1);
    await expect.element(list.getByText("Dwayne Hicks")).toBeVisible();
  });

  test("hands its metadata to useListMetadata", async () => {
    const MetadataProbe = defineComponent(() => {
      const metadata = useListMetadata<{ source: string }>();
      return () => h(Text, null, () => `from ${metadata.value?.source}`);
    });

    const { host } = renderRemote(
      defineComponent(
        () => () =>
          h(
            List,
            { "aria-label": "Crew" },
            {
              default: () => [
                h(ListLoaderComposable, {
                  loader: () => ({
                    data: crew,
                    metadata: { source: "the composable" },
                  }),
                }),
                crewItem(),
              ],
              summary: () => h(MetadataProbe),
            },
          ),
      ),
    );

    await expect
      .element(hostLocator(host).getByText("from the composable"))
      .toBeVisible();
  });
});

/*
 * React rebuilds its list on every render, so everything the app hands it is
 * current. The Vue list is built once and has to follow what changes.
 */
describe("Following the app's state", () => {
  const crewItem = () =>
    h(
      ListItem,
      { textValue: (data: Crew) => data.name },
      {
        default: ({ data }: { data: Crew }) =>
          h(ListItemView, null, () => h(Heading, null, () => data.name)),
      },
    );

  const firstRow = (list: ReturnType<typeof renderList>) =>
    list.getByRole("row").elements()[0]?.getAttribute("aria-label");

  test("asks a server-side loader again when the sorting changes", async () => {
    const loader = vi.fn(
      (options: { sorting?: Partial<Record<keyof Crew, string>> }) =>
        Promise.resolve({
          data:
            options.sorting?.name === "asc"
              ? [...crew].sort((a, b) => a.name.localeCompare(b.name))
              : crew,
          itemTotalCount: crew.length,
        }),
    );

    const list = renderList(() => [
      h(ListLoaderAsync, { manualPagination: true, loader }),
      h(ListSorting, { property: "name", name: "Name", direction: "asc" }),
      crewItem(),
    ]);

    await expect.poll(() => firstRow(list)).toBe("Ellen Ripley");

    await userEvent.click(list.getByRole("button", { name: "Sorting" }));
    await userEvent.click(page.getByRole("menuitemradio", { name: "Name" }));

    await expect.poll(() => firstRow(list)).toBe("Carter Burke");
    expect(loader.mock.lastCall?.[0].sorting).toEqual({ name: "asc" });
  });

  test("loads again when the loader's dependencies change", async () => {
    const ship = ref("Sulaco");
    const loader = vi.fn(() =>
      Promise.resolve({
        data: [
          {
            name: `Ripley of the ${ship.value}`,
            rank: "Warrant Officer",
            joined: "2026-09-10",
          },
        ],
        itemTotalCount: 1,
      }),
    );

    const { host } = renderRemote(
      defineComponent(
        () => () =>
          h(List, { "aria-label": "Crew" }, () => [
            h(ListLoaderAsync, { loader, dependencies: [ship.value] }),
            crewItem(),
          ]),
      ),
    );
    const list = hostLocator(host);

    await expect.element(list.getByText("Ripley of the Sulaco")).toBeVisible();

    ship.value = "Nostromo";

    await expect
      .element(list.getByText("Ripley of the Nostromo"))
      .toBeVisible();
  });

  test("offers filter values the app hands it later", async () => {
    const ranks = ref<string[]>([]);

    const { host } = renderRemote(
      defineComponent(
        () => () =>
          h(List, { "aria-label": "Crew" }, () => [
            h(ListStaticData, { data: crew }),
            h(ListFilter, {
              property: "rank",
              mode: "some",
              name: "Rank",
              values: ranks.value,
            }),
            crewItem(),
          ]),
      ),
    );
    const list = hostLocator(host);
    await expect.element(list.getByText("Ellen Ripley")).toBeVisible();

    ranks.value = ["Corporal"];

    await userEvent.click(list.getByRole("button", { name: "Rank" }));
    await expect
      .element(page.getByRole("menuitemcheckbox", { name: "Corporal" }))
      .toBeVisible();
  });

  test("shows items pushed into the static data in place", async () => {
    const data = ref<Crew[]>([...crew]);

    const { host } = renderRemote(
      defineComponent(
        () => () =>
          h(List, { "aria-label": "Crew" }, () => [
            h(ListStaticData, { data: data.value }),
            crewItem(),
          ]),
      ),
    );
    const list = hostLocator(host);
    await expect.element(list.getByText("Ellen Ripley")).toBeVisible();

    data.value.push({ name: "Bishop", rank: "Android", joined: "2026-09-01" });

    await expect.element(list.getByText("Bishop")).toBeVisible();
  });

  /*
   * The table's columns are the properties the data has. Collected only from
   * the first data, a list that starts empty would search nothing.
   */
  test("searches data that arrives after the list was built", async () => {
    const data = ref<Crew[]>([]);

    const { host } = renderRemote(
      defineComponent(
        () => () =>
          h(List, { "aria-label": "Crew" }, () => [
            h(ListStaticData, { data: data.value }),
            h(ListSearch),
            crewItem(),
          ]),
      ),
    );
    const list = hostLocator(host);
    /* Built, and empty: the remote app mounts once the host has connected. */
    await expect.element(list.getByText("No items available")).toBeVisible();

    data.value = [...crew];
    await expect.element(list.getByText("Ellen Ripley")).toBeVisible();

    await userEvent.fill(list.getByRole("searchbox"), "Ripley");

    await expect
      .element(list.getByText("Dwayne Hicks"))
      .not.toBeInTheDocument();
    await expect.element(list.getByText("Ellen Ripley")).toBeVisible();
  });
});
