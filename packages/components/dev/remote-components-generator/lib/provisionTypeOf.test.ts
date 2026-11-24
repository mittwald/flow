import { describe, expect, it } from "vitest";
import { provisionTypeOf } from "./provisionTypeOf";

describe("provisionTypeOf", () => {
  it("reads the type of the named flowComponent", () => {
    const source = `
      const Inner = flowComponent("Inner", Impl, { type: "provider" });
      export const Card = flowComponent("Card", (props) => null, {
        type: "layout",
      });
    `;
    expect(provisionTypeOf(source, "Card")).toBe("layout");
    expect(provisionTypeOf(source, "Inner")).toBe("provider");
  });

  it("returns undefined without options or without a type", () => {
    expect(provisionTypeOf(`flowComponent("A", Impl)`, "A")).toBeUndefined();
    expect(
      provisionTypeOf(
        `flowComponent("A", Impl, { isRemoteComponent: true })`,
        "A",
      ),
    ).toBeUndefined();
  });

  it("returns undefined for a plain component", () => {
    expect(
      provisionTypeOf(`export const A = () => null;`, "A"),
    ).toBeUndefined();
  });

  it("throws when the type is not a string literal", () => {
    expect(() =>
      provisionTypeOf(`flowComponent("A", Impl, { type: someType })`, "A"),
    ).toThrow(/flowComponent type of A/);
    expect(() =>
      provisionTypeOf(`flowComponent("A", Impl, options)`, "A"),
    ).toThrow(/flowComponent type of A/);
  });
});
