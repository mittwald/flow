import { render, screen } from "@testing-library/react";
import { List, ListItem, ListStaticData } from "@/components/List";
import React from "react";
import { test } from "vitest";

test("renders empty list without errors", async () => {
  render(<List />);
});

describe("Static data", () => {
  test("Items are updated when data changes", async () => {
    const renderTest = (items: number[]) => {
      render(
        <List>
          <ListStaticData data={items} />
          <ListItem<number> textValue={(num) => String(num)}>
            {(num) => <span>{num}</span>}
          </ListItem>
        </List>,
      );
    };

    renderTest([42]);
    await screen.findByText(42);

    renderTest([42, 43]);
    await screen.findByText(42);
    await screen.findByText(43);
  });
});
