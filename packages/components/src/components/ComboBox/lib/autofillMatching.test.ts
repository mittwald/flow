import type { CollectionNodeLike } from "./autofillMatching";
import { findMatchingKey } from "./autofillMatching";

const item = (key: string, textValue: string): CollectionNodeLike => ({
  key,
  type: "item",
  textValue,
});

const planets: CollectionNodeLike[] = [
  item("tatooine", "Tatooine"),
  item("naboo", "Naboo"),
  item("coruscant", "Coruscant"),
  item("corellia", "Corellia"),
];

test.each([
  ["exact text match", "Tatooine", "tatooine"],
  ["case-insensitive and trimmed", "  tAtOoInE ", "tatooine"],
  ["key match", "naboo", "naboo"],
  ["unique prefix match", "Nab", "naboo"],
  ["exact text preferred over prefix", "Coruscant", "coruscant"],
  ["ambiguous prefix (Coruscant/Corellia)", "Cor", null],
  ["unknown value", "Alderaan", null],
  ["empty value", "", null],
  ["whitespace-only value", "   ", null],
])("%s: %j resolves to %j", (_label, input, expected) => {
  expect(findMatchingKey(planets, input)).toBe(expected);
});

test("finds items nested in sections", () => {
  const nested: CollectionNodeLike[] = [
    {
      key: "section-outer-rim",
      type: "section",
      childNodes: [item("tatooine", "Tatooine")],
    },
  ];
  expect(findMatchingKey(nested, "Tatooine")).toBe("tatooine");
});
