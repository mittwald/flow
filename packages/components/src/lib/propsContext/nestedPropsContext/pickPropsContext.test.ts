import { expect, test } from "vitest";
import { pickPropsContext } from "~/lib/propsContext/nestedPropsContext/pickPropsContext";
import type { ComponentPropsContext } from "~/lib/propsContext/types";

test.each<[ComponentPropsContext<"Text">, ComponentPropsContext<"Text">]>([
  [{ className: "bar" }, {}],
  [{ className: "bar", Text: {} }, { Text: {} }],
  [
    { className: "bar", Text: { className: "foo" } },
    { Text: { className: "foo" } },
  ],
  [{ Text: { className: "foo" } }, { Text: { className: "foo" } }],
  [
    { Text: { className: "foo" }, Button: { className: "bar" } },
    { Text: { className: "foo" }, Button: { className: "bar" } },
  ],
  [
    {
      Text: { className: "foo" },
      className: "bar",
      Button: { className: "bar" },
    },
    { Text: { className: "foo" }, Button: { className: "bar" } },
  ],
  [{}, {}],
])("Picked context from %o is as expected %o", (source, picked) => {
  expect(pickPropsContext(source)).toEqual(picked);
});
