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
import { type ReactNode } from "react";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";
import {
  SettingsProvider,
  type SettingsBackend,
  type SettingsJson,
} from "../SettingsProvider";
import { FilterValue } from "./model/filter/FilterValue";
import Content from "../Content";

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

    // Appending items must not re-run the render of the existing ones — their
    // memoized item components bail out on the unchanged (id, data).
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
