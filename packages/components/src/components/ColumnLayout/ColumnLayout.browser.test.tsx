import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { ColumnLayout } from "@/components/ColumnLayout";

const columnWidths = (container: Element): number[] => {
  const columns = container.querySelectorAll("[data-testid=column]");
  if (columns.length === 0) {
    throw new Error("No columns rendered");
  }
  return Array.from(columns, (column) => column.getBoundingClientRect().width);
};

test("keeps the column ratio when a column holds wider content", async () => {
  const screen = await render(
    <div style={{ width: "900px" }}>
      <ColumnLayout l={[2, 1]} gap="s">
        <div data-testid="column" />
        <div data-testid="column">
          <div style={{ width: "500px" }} />
        </div>
      </ColumnLayout>
    </div>,
  );

  const [first = NaN, second = NaN] = columnWidths(screen.container);

  expect(first).toBeCloseTo(second * 2, 0);
});

test("keeps default columns equal when a column holds wider content", async () => {
  const screen = await render(
    <div style={{ width: "900px" }}>
      <ColumnLayout gap="s">
        <div data-testid="column" />
        <div data-testid="column">
          <div style={{ width: "500px" }} />
        </div>
        <div data-testid="column" />
      </ColumnLayout>
    </div>,
  );

  const [first = NaN, second = NaN, third = NaN] = columnWidths(
    screen.container,
  );

  expect(second).toBeCloseTo(first, 0);
  expect(third).toBeCloseTo(first, 0);
});
