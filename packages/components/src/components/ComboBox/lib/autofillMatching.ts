import type { Key } from "react-aria-components";

export interface CollectionNodeLike {
  key: Key;
  type: string;
  textValue?: string;
  childNodes?: Iterable<CollectionNodeLike>;
}

/**
 * React-aria's BaseCollection nodes throw on childNodes access and expose
 * children via getChildren(key) instead, while plain node objects (and older
 * collection implementations) carry a childNodes iterable.
 */
export interface CollectionLike extends Iterable<CollectionNodeLike> {
  getChildren?: (key: Key) => Iterable<CollectionNodeLike>;
}

export const collectItemNodes = (
  nodes: Iterable<CollectionNodeLike>,
  getChildren?: (key: Key) => Iterable<CollectionNodeLike>,
  result: CollectionNodeLike[] = [],
): CollectionNodeLike[] => {
  for (const node of nodes) {
    if (node.type === "item") {
      result.push(node);
    }
    const children = getChildren ? getChildren(node.key) : node.childNodes;
    if (children) {
      collectItemNodes(children, getChildren, result);
    }
  }
  return result;
};

const getChildrenAccessor = (collection: CollectionLike) =>
  collection.getChildren ? collection.getChildren.bind(collection) : undefined;

const normalize = (value: string): string => value.trim().toLocaleLowerCase();

/**
 * Tries to resolve a string value (e.g. filled in by browser autofill) to an
 * option key.
 *
 * Matching order:
 *
 * 1. Exact (case-insensitive) match on the option text
 * 2. Exact (case-insensitive) match on the option key
 * 3. Unique (case-insensitive) prefix match on the option text
 */
export const findMatchingKey = (
  collection: CollectionLike,
  rawValue: string,
): Key | null => {
  const value = normalize(rawValue);
  if (!value) {
    return null;
  }

  const items = collectItemNodes(collection, getChildrenAccessor(collection));

  const exactTextMatch = items.find(
    (item) => normalize(item.textValue ?? "") === value,
  );
  if (exactTextMatch) {
    return exactTextMatch.key;
  }

  const exactKeyMatch = items.find(
    (item) => normalize(String(item.key)) === value,
  );
  if (exactKeyMatch) {
    return exactKeyMatch.key;
  }

  const prefixMatches = items.filter((item) =>
    normalize(item.textValue ?? "").startsWith(value),
  );
  if (prefixMatches.length === 1 && prefixMatches[0]) {
    return prefixMatches[0].key;
  }

  return null;
};
