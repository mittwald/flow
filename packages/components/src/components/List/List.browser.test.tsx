import { render } from "vitest-browser-react";
import {
  List,
  ListFilter,
  ListItem,
  ListItemView,
  ListSorting,
  ListStaticData,
} from "@/components/List";
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
