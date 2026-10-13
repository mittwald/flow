import { expect, test } from "vitest";
import { ListItemCollection } from "./ListItemCollection";
import { fakePaginationContext } from "../testing/fakePaginationContext";

test("reads the rows the table currently shows", () => {
  const context = fakePaginationContext({ rows: ["a", "b", "c"] });
  const items = new ListItemCollection(context);

  expect(items.entries.map((i) => i.data)).toEqual(["a", "b", "c"]);
  expect(items.entries.map((i) => i.id)).toEqual(["0", "1", "2"]);
});

test("follows the table rather than caching", () => {
  const context = fakePaginationContext({ rows: ["a", "b", "c"] });
  const items = new ListItemCollection(context);

  expect(items.entries).toHaveLength(3);
  context.pagination = { pageIndex: 0, pageSize: 1 };

  expect(items.entries.map((i) => i.data)).toEqual(["a"]);
});
