import { expect, test } from "vitest";
import { Serializer } from "@/serialization/Serializer";

const testSerializer = new Serializer<string, string>({
  name: "Test",
  serialize: {
    isApplicable: (something) => something === "foo",
    apply: (current) => `${current}-bar`,
  },
  deserialize: {
    apply: (fooBar: string) => `${fooBar}-baz`,
  },
});

test("Serializer will not tamper values that are not applicable", async () => {
  expect(testSerializer.serialize("hello")).toStrictEqual({
    applied: false,
  });

  expect(testSerializer.deserialize("hello")).toStrictEqual({
    applied: false,
  });
});

test("Serializer will tamper values when applicable", async () => {
  expect(testSerializer.serialize("foo")).toStrictEqual({
    applied: true,
    result: {
      "mittwald.flow-remote-core.serializer.name": "Test",
      value: "foo-bar",
    },
  });

  expect(
    testSerializer.deserialize({
      "mittwald.flow-remote-core.serializer.name": "Test",
      value: "foo-bar",
    }),
  ).toStrictEqual({
    applied: true,
    result: {
      "mittwald.flow-remote-core.serializer.name": "Test",
      value: "foo-bar-baz",
    },
  });
});
