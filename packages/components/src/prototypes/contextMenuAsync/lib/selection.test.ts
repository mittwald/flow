import type { Key } from "react-aria-components";
import { mergeSelection, resolveSelection } from "./selection";

const set = (...keys: Key[]) => new Set<Key>(keys);

describe("mergeSelection", () => {
  test("keeps a selected key that the collection no longer renders", () => {
    // "b" was selected, then filtered out. The collection reports only "a".
    const result = mergeSelection({
      previous: set("a", "b"),
      next: set("a"),
      visibleKeys: set("a"),
    });

    expect(result).toEqual(set("a", "b"));
  });

  test("deselects a key the user actually unchecked", () => {
    const result = mergeSelection({
      previous: set("a", "b"),
      next: set("b"),
      visibleKeys: set("a", "b"),
    });

    expect(result).toEqual(set("b"));
  });

  test("adds a key the user checked in a filtered collection", () => {
    const result = mergeSelection({
      previous: set("b"),
      next: set("a"),
      visibleKeys: set("a"),
    });

    expect(result).toEqual(set("b", "a"));
  });

  test("survives a collection that renders nothing at all", () => {
    // An in-flight async load empties the collection for a moment.
    const result = mergeSelection({
      previous: set("a", "b"),
      next: set(),
      visibleKeys: set(),
    });

    expect(result).toEqual(set("a", "b"));
  });

  test("clearing a fully visible collection clears the selection", () => {
    const result = mergeSelection({
      previous: set("a", "b"),
      next: set(),
      visibleKeys: set("a", "b"),
    });

    expect(result).toEqual(set());
  });
});

describe("resolveSelection", () => {
  test("resolves the 'all' wildcard against the visible keys", () => {
    expect(resolveSelection("all", set("a", "b"))).toEqual(set("a", "b"));
  });

  test("passes an explicit selection through", () => {
    expect(resolveSelection(set("a"), set("a", "b"))).toEqual(set("a"));
  });
});
