import { describe, test, expect } from "vitest";
import resolveNestedPromises from "@/utils/promise";

describe("Resolves Nested Promises", () => {
  test("resolves non promises", async () => {
    const resolved = await resolveNestedPromises([1, 2]);
    expect(resolved).toEqual([1, 2]);
  });
  test("resolves simple promise", async () => {
    const resolved = await resolveNestedPromises(Promise.resolve(1));
    expect(resolved).toBe(1);
  });
  test("resolves only native objects", async () => {
    const resolved = await resolveNestedPromises({
      foo: new ArrayBuffer(1337),
      bar: Promise.resolve(2),
    });
    expect(resolved).toEqual({
      foo: new ArrayBuffer(1337),
      bar: 2,
    });
  });
  test("resolves array promise", async () => {
    const resolved = await resolveNestedPromises([
      Promise.resolve(1),
      Promise.resolve(2),
    ]);
    expect(resolved).toEqual([1, 2]);
  });
  test("resolves key value promise", async () => {
    const resolved = await resolveNestedPromises({
      foo: Promise.resolve(1),
      bar: Promise.resolve(2),
    });
    expect(resolved).toEqual({
      bar: 2,
      foo: 1,
    });
  });
  test("resolves mixed promise", async () => {
    const resolved = await resolveNestedPromises({
      asd: 1,
      foo: Promise.resolve(2),
      bar: Promise.resolve(3),
      baz: [Promise.resolve(4), Promise.resolve(5)],
      qwe: [
        {
          asd: 6,
          foo: Promise.resolve(7),
          baz: [Promise.resolve(8), Promise.resolve(9)],
        },
      ],
    });
    expect(resolved).toEqual({
      asd: 1,
      bar: 3,
      baz: [4, 5],
      foo: 2,
      qwe: [
        {
          asd: 6,
          baz: [8, 9],
          foo: 7,
        },
      ],
    });
  });
});
