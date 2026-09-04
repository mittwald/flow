import { render } from "vitest-browser-react";
import {
  List,
  ListFilter,
  ListItem,
  ListItemView,
  ListLoaderAsync,
  ListSorting,
  ListStaticData,
} from "@/components/List";
import type { AsyncDataLoader } from "@/components/List/model/loading/types";
import { use, useState, type ReactNode } from "react";
import { expect, test, type Mock } from "vitest";
import { page, userEvent } from "vitest/browser";
import { RouterProvider } from "react-aria-components";
import {
  SettingsProvider,
  type SettingsBackend,
  type SettingsJson,
} from "../SettingsProvider";
import { FilterValue } from "./model/filter/FilterValue";
import Content from "../Content";
import { Table } from "./setupComponents/Table";
import { TableHeader } from "./setupComponents/TableHeader";
import { TableColumn } from "./setupComponents/TableColumn";
import { TableBody } from "./setupComponents/TableBody";
import { TableRow } from "./setupComponents/TableRow";
import { TableCell } from "./setupComponents/TableCell";
import { ColumnLayout } from "../ColumnLayout";
import { Heading } from "../Heading";
import { ContextMenu, MenuItem } from "../ContextMenu";

interface Data {
  num: number;
}

const getTestElement = (items: number[], children: ReactNode = null) => (
  <List aria-label="Test" settingStorageKey="test">
    {children}
    <ListStaticData<Data> data={items.map((num) => ({ num }))} />
    <ListItem<Data> textValue={(num) => String(num)}>
      {({ num }) => <span>Item: {num}</span>}
    </ListItem>
  </List>
);

const storeFilterButton = page.getByLabelText("Store filters");
const resetFilterButton = page.getByLabelText("Reset filters");
const removeFilterButton = page.getByLabelText("Remove");

const filterButton = page.getByRole("button", {
  name: "num",
});
const listItem42TextContent = "Item: 42";
const listItem43TextContent = "Item: 43";
const listItem42 = page.getByText(listItem42TextContent);
const listItem43 = page.getByText(listItem43TextContent);

const filterValueId42 = FilterValue.create(
  {
    property: "num",
  } as never,
  42,
).id;
const filterValueId43 = FilterValue.create(
  {
    property: "num",
  } as never,
  43,
).id;

const selectFilterOption = async (num: number) => {
  await userEvent.click(filterButton);
  await userEvent.click(page.getByRole("menuitemradio", { name: String(num) }));
};

let testIndex = 0;

beforeEach(() => {
  vitest.resetAllMocks();
  testIndex++;
});

test("renders empty list without errors", async () => {
  await render(<List />);
});

test("renders accordion list without errors", async () => {
  await render(
    <List accordion>
      <ListStaticData data={[1, 2, 3]} />
      <ListItem defaultExpanded={() => true}>
        {() => (
          <ListItemView>
            <Content slot="bottom">Item</Content>
          </ListItemView>
        )}
      </ListItem>
    </List>,
  );
});

describe("Static data", () => {
  test("Items are updated when data changes", async () => {
    const { rerender } = await render(getTestElement([42]));
    expect(listItem42).toBeInTheDocument();

    await rerender(getTestElement([42, 43]));
    expect(listItem42).toBeInTheDocument();
    expect(listItem43).toBeInTheDocument();
  });
});

describe("Filter", () => {
  test("Items are initially filtered by defaultSelected prop", async () => {
    await render(
      getTestElement(
        [42, 43],
        <ListFilter<Data> property="num" mode="one" defaultSelected={[42]} />,
      ),
    );
    expect(listItem42).toBeInTheDocument();
    expect(listItem43).not.toBeInTheDocument();
  });

  test("Reset filter button resets filter to default", async () => {
    await render(
      getTestElement(
        [42, 43],
        <ListFilter<Data> property="num" mode="one" defaultSelected={[42]} />,
      ),
    );
    expect(listItem42).toBeInTheDocument();
    expect(listItem43).not.toBeInTheDocument();

    await userEvent.click(removeFilterButton);
    expect(listItem42).toBeInTheDocument();
    expect(listItem43).toBeInTheDocument();

    await userEvent.click(resetFilterButton);
    expect(listItem42).toBeInTheDocument();
    expect(listItem43).not.toBeInTheDocument();
  });
});

describe("Storage", async () => {
  class MemorySettingsStorageBackend implements SettingsBackend {
    public data: SettingsJson = {};

    public async load() {
      return this.data;
    }

    public async store(data: SettingsJson) {
      this.data = data;
    }

    public clear() {
      this.data = {};
    }
  }

  const inMemoryBackend = new MemorySettingsStorageBackend();

  beforeEach(() => {
    inMemoryBackend.clear();
  });

  test("Only default value is taken if autosave is disabled", async () => {
    await inMemoryBackend.store({
      List: {
        "test.activeFilters.autosave": `{"num":["${filterValueId43}"]}`,
      },
    });

    await render(
      <SettingsProvider
        store={inMemoryBackend}
        type="custom"
        id={String(testIndex)}
      >
        {getTestElement(
          [42, 43],
          <ListFilter<Data>
            autosave={false}
            property="num"
            mode="one"
            defaultSelected={[42]}
          />,
        )}
      </SettingsProvider>,
    );

    expect(listItem42).toBeInTheDocument();
    expect(listItem43).not.toBeInTheDocument();
  });

  test("Only default value is taken if manualSave is disabled", async () => {
    await inMemoryBackend.store({
      List: {
        "test.activeFilters": `{"num":["${filterValueId43}"]}`,
      },
    });

    await render(
      <SettingsProvider
        store={inMemoryBackend}
        type="custom"
        id={String(testIndex)}
      >
        {getTestElement(
          [42, 43],
          <ListFilter<Data>
            manualSave={false}
            autosave={false}
            property="num"
            mode="one"
            defaultSelected={[42]}
          />,
        )}
      </SettingsProvider>,
    );

    expect(listItem42).toBeInTheDocument();
    expect(listItem43).not.toBeInTheDocument();
  });

  test("Autosaved filter is preferred over 'defaultSelected' prop", async () => {
    await inMemoryBackend.store({
      List: {
        "test.activeFilters.autosave": `{"num":["${filterValueId43}"]}`,
      },
    });

    await render(
      <SettingsProvider
        store={inMemoryBackend}
        type="custom"
        id={String(testIndex)}
      >
        {getTestElement(
          [42, 43],
          <ListFilter<Data>
            autosave
            property="num"
            mode="one"
            defaultSelected={[42]}
          />,
        )}
      </SettingsProvider>,
    );

    expect(listItem42).not.toBeInTheDocument();
    expect(listItem43).toBeInTheDocument();
  });

  test("Autosaved filter can be resetted to default", async () => {
    await inMemoryBackend.store({
      List: {
        "test.activeFilters.autosave": `{"num":["${filterValueId43}"]}`,
      },
    });

    await render(
      <SettingsProvider
        store={inMemoryBackend}
        type="custom"
        id={String(testIndex)}
      >
        {getTestElement(
          [42, 43],
          <ListFilter<Data>
            autosave
            property="num"
            mode="one"
            defaultSelected={[42]}
          />,
        )}
      </SettingsProvider>,
    );

    expect(listItem42).not.toBeInTheDocument();
    expect(listItem43).toBeInTheDocument();

    await userEvent.click(resetFilterButton);
    expect(listItem42).toBeInTheDocument();
    expect(listItem43).not.toBeInTheDocument();
  });

  test("Autosaved filter can be resetted to manually saved value", async () => {
    await inMemoryBackend.store({
      List: {
        "test.activeFilters.autosave": `{"num":["${filterValueId43}"]}`,
        "test.activeFilters": `{"num":["${filterValueId42}"]}`,
      },
    });

    await render(
      <SettingsProvider
        store={inMemoryBackend}
        type="custom"
        id={String(testIndex)}
      >
        {getTestElement(
          [42, 43],
          <ListFilter<Data> autosave property="num" mode="one" />,
        )}
      </SettingsProvider>,
    );

    expect(listItem42).not.toBeInTheDocument();
    expect(listItem43).toBeInTheDocument();

    await userEvent.click(resetFilterButton);
    expect(listItem42).toBeInTheDocument();
    expect(listItem43).not.toBeInTheDocument();
  });

  test("Manual saved filter can be resetted to saved value", async () => {
    await inMemoryBackend.store({
      List: {
        "test.activeFilters": `{"num":["${filterValueId43}"]}`,
      },
    });

    await render(
      <SettingsProvider
        store={inMemoryBackend}
        type="custom"
        id={String(testIndex)}
      >
        {getTestElement(
          [42, 43],
          <ListFilter<Data> manualSave property="num" mode="one" />,
        )}
      </SettingsProvider>,
    );

    expect(listItem42).not.toBeInTheDocument();
    expect(listItem43).toBeInTheDocument();

    await selectFilterOption(42);
    expect(listItem42).toBeInTheDocument();
    expect(listItem43).not.toBeInTheDocument();

    await userEvent.click(resetFilterButton);
    expect(listItem42).not.toBeInTheDocument();
    expect(listItem43).toBeInTheDocument();
  });

  test("Store settings button is visible if 'manualSave' is true", async () => {
    await render(
      <SettingsProvider
        store={inMemoryBackend}
        type="custom"
        id={String(testIndex)}
      >
        {getTestElement(
          [42, 43],
          <ListFilter<Data> manualSave property="num" mode="one" />,
        )}
      </SettingsProvider>,
    );

    await selectFilterOption(42);
    expect(storeFilterButton).toBeInTheDocument();
  });

  test("Store settings button is hidden after storing", async () => {
    await render(
      <SettingsProvider
        store={inMemoryBackend}
        type="custom"
        id={String(testIndex)}
      >
        {getTestElement(
          [42, 43],
          <ListFilter<Data> manualSave property="num" mode="one" />,
        )}
      </SettingsProvider>,
    );

    await selectFilterOption(42);
    await userEvent.click(storeFilterButton);
    expect(storeFilterButton).not.toBeInTheDocument();
  });

  test("No store settings button is visible if 'manualSave' is false", async () => {
    await render(
      <SettingsProvider
        store={inMemoryBackend}
        type="custom"
        id={String(testIndex)}
      >
        {getTestElement(
          [42, 43],
          <ListFilter<Data>
            autosave
            manualSave={false}
            property="num"
            mode="one"
          />,
        )}
      </SettingsProvider>,
    );

    await selectFilterOption(42);
    expect(storeFilterButton).not.toBeInTheDocument();
  });
});

describe("Infinite scroll", () => {
  const manyItems = Array.from({ length: 9 }, (_, i) => i);

  test("Loads the next batch only once the trigger row scrolls into view", async () => {
    const data = Array.from({ length: 15 }, (_, i) => ({ num: i }));

    await render(
      <List aria-label="Test" batchSize={10} infiniteScroll>
        <ListStaticData<Data> data={data} />
        <ListItem<Data> textValue={(num) => String(num)}>
          {({ num }) => (
            <span style={{ display: "block", height: "100vh" }}>
              Item: {num}
            </span>
          )}
        </ListItem>
      </List>,
    );

    // With batchSize 10 the trigger row sits ~2 rows before the end (item 8),
    // far below the fold, so no further batch is loaded on mount.
    await expect.element(page.getByText("Item: 0")).toBeInTheDocument();
    expect(page.getByText("Item: 10").query()).not.toBeInTheDocument();

    await (await page.getByText("Item: 8").element()).scrollIntoView();
    await expect.element(page.getByText("Item: 10")).toBeInTheDocument();

    expect(
      page.getByRole("button", { name: "Show more" }).query(),
    ).not.toBeInTheDocument();
  });

  test("Shows a loading indicator while the next batch is loading", async () => {
    let resolveSecondBatch: (() => void) | undefined;

    const loader: AsyncDataLoader<Data> = async (opts) => {
      const offset = opts?.pagination?.offset ?? 0;
      // Keep only the first following batch pending so the loading indicator can
      // be observed; later batches resolve immediately.
      if (offset === 3) {
        await new Promise<void>((resolve) => {
          resolveSecondBatch = resolve;
        });
      }
      return {
        data: manyItems.slice(offset, offset + 3).map((num) => ({ num })),
        itemTotalCount: manyItems.length,
      };
    };

    await render(
      <List aria-label="Test" batchSize={3} infiniteScroll>
        <ListLoaderAsync<Data> manualPagination>{loader}</ListLoaderAsync>
        <ListItem<Data> textValue={(num) => String(num)}>
          {({ num }) => <span>Item: {num}</span>}
        </ListItem>
      </List>,
    );

    // First batch is short, so the trigger row is visible and auto-loads the
    // (pending) second batch.
    await expect.element(page.getByText("Item: 2")).toBeInTheDocument();

    // While the next batch is pending, a generic loading indicator is shown and
    // the pagination count stays stable instead of turning into a skeleton.
    await expect
      .element(page.getByLabelText("Loading more items"))
      .toBeInTheDocument();
    expect(page.getByText("Showing 3 of 9")).toBeInTheDocument();

    // The already-loaded items must stay fully visible while the next batch
    // loads — the footer spinner communicates the load instead of dimming the
    // whole area (regression guard for the list briefly turning dark on scroll).
    const grid = await page.getByRole("grid").element();
    expect(getComputedStyle(grid).opacity).toBe("1");

    resolveSecondBatch?.();

    // Once every batch has loaded, the indicator disappears again.
    await expect.element(page.getByText("Item: 8")).toBeInTheDocument();
    await expect
      .element(page.getByLabelText("Loading more items"))
      .not.toBeInTheDocument();
  });

  test("Already-loaded items are not re-rendered when the next batch loads", async () => {
    const data = Array.from({ length: 9 }, (_, i) => ({ num: i }));
    const renderCounts: Record<number, number> = {};

    const loader: AsyncDataLoader<Data> = async (opts) => {
      const offset = opts?.pagination?.offset ?? 0;
      return {
        data: data.slice(offset, offset + 3),
        itemTotalCount: data.length,
      };
    };

    await render(
      <List aria-label="Test" batchSize={3} infiniteScroll>
        <ListLoaderAsync<Data> manualPagination>{loader}</ListLoaderAsync>
        <ListItem<Data> textValue={(num) => String(num)}>
          {({ num }) => {
            renderCounts[num] = (renderCounts[num] ?? 0) + 1;
            return <span>Item: {num}</span>;
          }}
        </ListItem>
      </List>,
    );

    await expect.element(page.getByText("Item: 2")).toBeInTheDocument();

    // Baseline for items that never carry the moving infinite-scroll trigger.
    const before0 = renderCounts[0];
    const before1 = renderCounts[1];

    // Scrolling the trigger row into view appends the next batch(es).
    await (await page.getByText("Item: 2").element()).scrollIntoView();
    await expect.element(page.getByText("Item: 5")).toBeInTheDocument();

    // Appending items must not re-run the render of the existing ones — the
    // list model is rebuilt, but the render functions it carries come from the
    // unchanged JSX above, so the memoized item components bail out.
    expect(renderCounts[0]).toBe(before0);
    expect(renderCounts[1]).toBe(before1);
  });

  test("Without infiniteScroll only the first batch loads", async () => {
    await render(
      <List aria-label="Test" batchSize={3}>
        <ListStaticData<Data> data={manyItems.map((num) => ({ num }))} />
        <ListItem<Data> textValue={(num) => String(num)}>
          {({ num }) => <span>Item: {num}</span>}
        </ListItem>
      </List>,
    );

    await expect.element(page.getByText("Item: 2")).toBeInTheDocument();
    expect(page.getByText("Item: 3").query()).not.toBeInTheDocument();
    await expect
      .element(page.getByRole("button", { name: "Show more" }))
      .toBeInTheDocument();
  });
});

describe("Sorting", () => {
  test("Hidden sorting works", async () => {
    await render(
      getTestElement(
        [43, 42],
        <ListSorting<Data> defaultEnabled="hidden" property="num" />,
      ),
    );
    expect(page.getByRole("grid")).toHaveTextContent(
      listItem42TextContent + listItem43TextContent,
    );
  });
});

describe("Loading view", () => {
  const neverResolvingPromise = new Promise(() => {
    // never resolves
  });

  const SuspendingContent = () => {
    use(neverResolvingPromise);
    return null;
  };

  const getTestElementWithSuspendingItem = (viewMode: "list" | "tiles") => (
    <List aria-label="Test" defaultViewMode={viewMode} loadingItemsCount={1}>
      <ListStaticData<Data> data={[{ num: 42 }, { num: 43 }]} />
      <ListItem<Data>
        showTiles
        textValue={({ num }) => String(num)}
        loadingView={
          <ListItemView>
            <Content>Loading item</Content>
          </ListItemView>
        }
      >
        {({ num }) =>
          num === 42 ? (
            <ListItemView>
              <Content>
                <SuspendingContent />
              </Content>
            </ListItemView>
          ) : (
            <span>{listItem43TextContent}</span>
          )
        }
      </ListItem>
    </List>
  );

  test.each(["list", "tiles"] as const)(
    "Suspended items use the item's loading view (%s view)",
    async (viewMode) => {
      await render(getTestElementWithSuspendingItem(viewMode));

      // The loaded item proves the initial loading views are gone; only the
      // suspended item still renders a loading view.
      await expect.element(listItem43).toBeInTheDocument();
      await expect.element(page.getByText("Loading item")).toBeInTheDocument();
    },
  );
});

describe("Item rendering", () => {
  // Stable identity: the memoized item is only skipped while its data is
  // unchanged, which is what a real loader returns between renders.
  const selectableData: Data[] = [{ num: 42 }];

  const SelectableList = () => {
    const [selected, setSelected] = useState<number[]>([]);

    return (
      <List
        aria-label="Test"
        onAction={({ num }: Data) =>
          setSelected((current) =>
            current.includes(num)
              ? current.filter((n) => n !== num)
              : [...current, num],
          )
        }
      >
        <ListStaticData<Data> data={selectableData} />
        <ListItem<Data> textValue={({ num }) => String(num)}>
          {({ num }) => (
            <span>
              Item: {num} {selected.includes(num) ? "selected" : "unselected"}
            </span>
          )}
        </ListItem>
      </List>
    );
  };

  test("items follow state the consumer renders them from", async () => {
    await render(<SelectableList />);

    await userEvent.click(page.getByText("Item: 42 unselected"));
    await expect
      .element(page.getByText("Item: 42 selected"))
      .toBeInTheDocument();

    await userEvent.click(page.getByText("Item: 42 selected"));
    await expect
      .element(page.getByText("Item: 42 unselected"))
      .toBeInTheDocument();
  });
});

/*
 * `.list` replaced `container-type: inline-size` with `min-width: 0` (#2655).
 * The containment was zeroing the list's intrinsic inline contribution, and an
 * `Nfr` grid track is `minmax(auto, Nfr)` with a content-based minimum — so
 * without a replacement a list with unbreakable content pushes its own track
 * open and the columns stop being equal. Measured in a 400px two-track grid:
 * 196/196 with either containment or `min-width: 0`, and 479/49 (list view) to
 * 704/49 (table view) with neither.
 */
test.each(["list", "tiles", "table"] as const)(
  "does not blow out an equal-width grid track (%s view)",
  async (viewMode) => {
    await render(
      <div style={{ width: 400 }}>
        <ColumnLayout s={[1, 1]} gap="s">
          <List aria-label="Wide" defaultViewMode={viewMode}>
            <ListStaticData<Data> data={[{ num: 1 }]} />
            <ListItem<Data> textValue={() => "wide"}>
              {() => (
                <span style={{ whiteSpace: "nowrap" }}>
                  unbreakable-item-content-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                </span>
              )}
            </ListItem>
            <Table<Data>>
              <TableHeader<Data>>
                <TableColumn<Data>>
                  Averyverylongcolumnheadingnobreaks
                </TableColumn>
                <TableColumn<Data>>
                  Anotherverylongcolumnheadingnobreaks
                </TableColumn>
              </TableHeader>
              <TableBody<Data>>
                <TableRow<Data>>
                  <TableCell<Data>>
                    {() => "unbreakable-cell-content-aaaaaaaaaaaaaaaa"}
                  </TableCell>
                  <TableCell<Data>>
                    {() => "unbreakable-cell-content-bbbbbbbbbbbbbbbb"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </List>
          <span data-testid="sibling">sibling</span>
        </ColumnLayout>
      </div>,
    );
    const sibling = page.getByTestId("sibling").element();
    const listElement = sibling.previousElementSibling as HTMLElement;

    // The items load asynchronously; measuring before they are in the DOM
    // measures an empty list, which cannot blow anything out.
    await vitest.waitUntil(() =>
      listElement.textContent?.includes("unbreakable"),
    );

    expect(listElement.getBoundingClientRect().width).toBeCloseTo(
      sibling.getBoundingClientRect().width,
      0,
    );
  },
);

describe("Linked items", () => {
  const itemHref = `${location.origin}/domains/42`;

  let navigate: Mock;
  let onAction: Mock;
  let menuAction: Mock;

  beforeEach(() => {
    navigate = vitest.fn();
    onAction = vitest.fn();
    menuAction = vitest.fn();
  });

  const getTestElementWithLink = (target?: string) => (
    <RouterProvider navigate={navigate}>
      <List aria-label="Test" onAction={onAction}>
        <ListStaticData<Data> data={[{ num: 42 }]} />
        <ListItem<Data>
          textValue={({ num }) => String(num)}
          href={({ num }) => `${location.origin}/domains/${num}`}
          target={target}
        >
          {({ num }) => (
            <ListItemView>
              <Heading>Item: {num}</Heading>
              <ContextMenu onAction={menuAction}>
                <MenuItem id="delete">Delete</MenuItem>
              </ContextMenu>
            </ListItemView>
          )}
        </ListItem>
      </List>
    </RouterProvider>
  );

  const row = page.getByRole("row");
  const optionsButton = page.getByRole("button", { name: "Options" });

  const getRowLink = async () =>
    (await row.element()).querySelector<HTMLAnchorElement>("a");

  test("a linked item renders a real anchor carrying the item's href", async () => {
    await render(getTestElementWithLink());
    await expect.element(page.getByText("Item: 42")).toBeInTheDocument();

    // Only a real <a href> gives the browser something to offer in its context
    // menu and to open on a middle- or modifier-click.
    expect(await getRowLink()).toHaveAttribute("href", itemHref);
  });

  test("the anchor carries the item's link target", async () => {
    await render(getTestElementWithLink("_blank"));
    await expect.element(page.getByText("Item: 42")).toBeInTheDocument();

    expect(await getRowLink()).toHaveAttribute("target", "_blank");
  });

  test("an item without a href renders no anchor", async () => {
    await render(getTestElement([42]));
    await expect.element(page.getByText("Item: 42")).toBeInTheDocument();

    expect((await row.element()).querySelector("a")).toBeNull();
  });

  test("the anchor adds neither a tab stop nor a second link for screen readers", async () => {
    await render(getTestElementWithLink());
    await expect.element(page.getByText("Item: 42")).toBeInTheDocument();

    // The row keeps owning activation and semantics — the anchor exists purely
    // for the browser's own link affordances. It also has to stay untabbable
    // because react-aria treats a tabbable descendant as interactive content
    // and then stops the row's own press.
    const link = await getRowLink();
    expect(link?.tabIndex).toBe(-1);
    expect(link).toHaveAttribute("aria-hidden", "true");
  });

  test("the anchor sits under the pointer, interactive content above it", async () => {
    await render(getTestElementWithLink());
    await expect.element(optionsButton).toBeInTheDocument();

    const elementAtCenterOf = (element: Element) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      return document.elementFromPoint(left + width / 2, top + height / 2);
    };

    // The browser's context menu acts on whatever sits under the pointer, so
    // the anchor has to win over the item's plain content …
    const link = await getRowLink();
    expect(elementAtCenterOf(await page.getByText("Item: 42").element())).toBe(
      link,
    );

    // … and lose against everything the user is meant to interact with.
    const button = await optionsButton.element();
    expect(button.contains(elementAtCenterOf(button))).toBe(true);
  });

  test("clicking a linked item navigates exactly once", async () => {
    await render(getTestElementWithLink());
    await expect.element(page.getByText("Item: 42")).toBeInTheDocument();

    await userEvent.click(row);

    // Both the anchor's default action and react-aria's press handler could
    // navigate — react-aria cancels the former, so this must stay at one.
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(itemHref, undefined);
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  test("keyboard activation navigates", async () => {
    await render(getTestElementWithLink());
    await expect.element(page.getByText("Item: 42")).toBeInTheDocument();

    (await row.element()).focus();
    await userEvent.keyboard("{Enter}");

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(itemHref, undefined);
  });

  test("a nested context menu stays clickable and does not trigger the item", async () => {
    await render(getTestElementWithLink());
    await expect.element(optionsButton).toBeInTheDocument();

    await userEvent.click(optionsButton);
    await expect
      .element(page.getByRole("menuitem", { name: "Delete" }))
      .toBeInTheDocument();

    // Regression guard for #1250's first attempt (#2420, reverted): pressing
    // interactive content inside an item must not additionally run the item's
    // action or follow its link.
    expect(onAction).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  test("a nested menu item runs its own action only", async () => {
    await render(getTestElementWithLink());
    await expect.element(optionsButton).toBeInTheDocument();

    await userEvent.click(optionsButton);
    await userEvent.click(page.getByRole("menuitem", { name: "Delete" }));

    expect(menuAction).toHaveBeenCalledWith("delete", undefined);
    expect(onAction).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
