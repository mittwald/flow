import { render } from "vitest-browser-react";
import { List, ListFilter, ListItem, ListStaticData } from "@/components/List";
import { type ReactNode } from "react";
import { test } from "vitest";
import { page } from "vitest/browser";

test("renders empty list without errors", async () => {
  await render(<List />);
});
interface Data {
  num: number;
}

const getTestElement = (items: number[], children: ReactNode = null) => (
  <List aria-label="Test">
    {children}
    <ListStaticData<Data> data={items.map((num) => ({ num }))} />
    <ListItem<Data> textValue={(num) => String(num)}>
      {({ num }) => <span>{num}</span>}
    </ListItem>
  </List>
);

describe("Static data", () => {
  test("Items are updated when data changes", async () => {
    const { rerender } = await render(getTestElement([42]));
    expect(page.getByText("42")).toBeInTheDocument();

    await rerender(getTestElement([42, 43]));
    expect(page.getByText("42")).toBeInTheDocument();
    expect(page.getByText("43")).toBeInTheDocument();
  });
});

describe("Filter", () => {
  test("Items are initially filtered", async () => {
    await render(
      getTestElement(
        [42, 43],
        <ListFilter<Data> property="num" mode="one" defaultSelected={[42]} />,
      ),
    );
    expect(page.getByText("42").all()).toHaveLength(1);
    expect(page.getByText("43").all()).toHaveLength(0);
  });
});
