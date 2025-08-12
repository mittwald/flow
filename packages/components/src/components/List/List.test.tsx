import { render, screen } from "@testing-library/react";
import { List, ListFilter, ListItem, ListStaticData } from "@/components/List";
import type { ReactNode } from "react";
import React from "react";
import { test } from "vitest";

test("renders empty list without errors", async () => {
  render(<List />);
});
interface Data {
  num: number;
}

const renderTest = (items: number[], children: ReactNode = null) => {
  render(
    <List aria-label="Test">
      {children}
      <ListStaticData<Data> data={items.map((num) => ({ num }))} />
      <ListItem<Data> textValue={(num) => String(num)}>
        {({ num }) => <span>{num}</span>}
      </ListItem>
    </List>,
  );
};

describe("Static data", () => {
  test("Items are updated when data changes", async () => {
    renderTest([42]);
    await screen.findByText(42);

    renderTest([42, 43]);
    await screen.findByText(42);
    await screen.findByText(43);
  });
});

describe("Filter", () => {
  test("Items are initially filtered", async () => {
    renderTest(
      [42, 43],
      <ListFilter<Data> property="num" mode="one" defaultSelected={[42]} />,
    );
    expect(screen.queryAllByText(42)).toHaveLength(1);
    expect(screen.queryAllByText(43)).toHaveLength(0);
  });
});
