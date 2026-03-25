import { render } from "vitest-browser-react";
import { List, ListFilter, ListItem, ListStaticData } from "@/components/List";
import { type ReactNode } from "react";
import { test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { SettingsProvider, type SettingsBackend } from "../SettingsProvider";
import { FilterValue } from "./model/filter/FilterValue";

test("renders empty list without errors", async () => {
  await render(<List />);
});
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

describe("Static data", () => {
  test("Items are updated when data changes", async () => {
    const { rerender } = await render(getTestElement([42]));
    expect(page.getByText("42")).toBeInTheDocument();

    await rerender(getTestElement([42, 43]));
    expect(page.getByText("Item: 42")).toBeInTheDocument();
    expect(page.getByText("Item: 43")).toBeInTheDocument();
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
    expect(page.getByText("Item: 42").all()).toHaveLength(1);
    expect(page.getByText("Item: 43").all()).toHaveLength(0);
  });

  test("Items are initially filtered by initialSelected prop", async () => {
    await render(
      getTestElement(
        [42, 43],
        <ListFilter<Data> property="num" mode="one" initialSelected={[42]} />,
      ),
    );
    expect(page.getByText("Item: 42").all()).toHaveLength(1);
    expect(page.getByText("Item: 43").all()).toHaveLength(0);
  });
});

describe("Storage", async () => {
  test("Autosaved filter is preferred over 'defaultSelected' prop", async () => {
    const autosavedValue = 43;
    const otherValue = 42;

    const storedFilterValue = FilterValue.create(
      {
        property: "num",
      } as never,
      autosavedValue,
    );

    const mockBackend: SettingsBackend = {
      load: vi.fn().mockResolvedValue({
        List: {
          "test.activeFilters.autosave": `{"num":["${storedFilterValue.id}"]}`,
        },
      }),
      store: vi.fn(),
    };

    await render(
      <SettingsProvider store={mockBackend} type="custom" id="test-1">
        {getTestElement(
          [otherValue, autosavedValue],
          <ListFilter<Data>
            autosave
            property="num"
            mode="one"
            defaultSelected={[otherValue]}
          />,
        )}
      </SettingsProvider>,
    );

    expect(page.getByText(`Item: ${autosavedValue}`).all()).toHaveLength(1);
    expect(page.getByText(`Item: ${otherValue}`).all()).toHaveLength(0);

    const resetButton = page.getByLabelText("Reset filter");
    await userEvent.click(resetButton);

    expect(page.getByText(`Item: ${otherValue}`).all()).toHaveLength(1);
    expect(page.getByText(`Item: ${autosavedValue}`).all()).toHaveLength(0);
  });

  test("Initial filters can be resetted to the stored filters", async () => {
    const storedValue = 43;
    const otherValue = 42;

    const storedFilterValue = FilterValue.create(
      {
        property: "num",
      } as never,
      storedValue,
    );

    const mockBackend: SettingsBackend = {
      load: vi.fn().mockResolvedValue({
        List: {
          "test.activeFilters": `{"num":["${storedFilterValue.id}"]}`,
        },
      }),
      store: vi.fn(),
    };

    await render(
      <SettingsProvider store={mockBackend} type="custom" id="test-2">
        {getTestElement(
          [otherValue, storedValue],
          <ListFilter<Data>
            property="num"
            mode="one"
            initialSelected={[otherValue]}
          />,
        )}
      </SettingsProvider>,
    );

    expect(page.getByText(`Item: ${storedValue}`).all()).toHaveLength(0);
    expect(page.getByText(`Item: ${otherValue}`).all()).toHaveLength(1);

    const resetButton = page.getByLabelText("Reset filter");
    await userEvent.click(resetButton);

    expect(page.getByText(`Item: ${storedValue}`).all()).toHaveLength(1);
    expect(page.getByText(`Item: ${otherValue}`).all()).toHaveLength(0);
  });
});
