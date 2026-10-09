import jetpack from "fs-jetpack";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import {
  componentNamespace,
  hasNamespace,
  parseTokensAttribute,
  resolveNamespaces,
  splitByTheme,
} from "@/lib/componentTokens/loadComponentTokens";

describe("componentNamespace", () => {
  it("converts the component name to kebab-case", () => {
    expect(componentNamespace("Button")).toBe("button");
    expect(componentNamespace("TextField")).toBe("text-field");
    expect(componentNamespace("Date Picker")).toBe("date-picker");
  });
});

describe("resolveNamespaces", () => {
  it("derives the namespace from the component name", () => {
    expect(resolveNamespaces("TextField")).toEqual(["text-field"]);
  });

  it("prefers the tokens attribute", () => {
    expect(resolveNamespaces("List", "list, list-item")).toEqual([
      "list",
      "list-item",
    ]);
  });
});

describe("splitByTheme", () => {
  it("puts colors and theme-dependent values in the per-theme table", () => {
    const tokens = [
      { name: "--a", light: "8px" },
      { name: "--b", light: "#FFFFFF" },
      { name: "--c", light: "gradient(#fff)", dark: "gradient(#000)" },
    ];
    expect(splitByTheme(tokens)).toEqual({
      single: [tokens[0]],
      perTheme: [tokens[1], tokens[2]],
    });
  });
});

describe("parseTokensAttribute", () => {
  it("reads the attribute", () => {
    expect(
      parseTokensAttribute(`<ComponentTokenTable tokens="list, list-item" />`),
    ).toBe("list, list-item");
  });

  it("returns nothing without the attribute", () => {
    expect(parseTokensAttribute("<ComponentTokenTable />")).toBeUndefined();
  });
});

describe("ComponentTokenTable in the content", () => {
  const usages = jetpack
    .find("src/content", { matching: "**/*.mdx" })
    .flatMap((file) => {
      const { data, content } = matter(jetpack.read(file) ?? "");
      const componentName = String(data.component ?? data.title ?? "");
      return [...content.matchAll(/<ComponentTokenTable\b[^>]*\/>/g)].map(
        ([tag]) => ({
          file,
          namespaces: resolveNamespaces(
            componentName,
            parseTokensAttribute(tag),
          ),
        }),
      );
    });

  it.each(usages)("$file resolves $namespaces", ({ namespaces }) => {
    expect(namespaces.filter((namespace) => !hasNamespace(namespace))).toEqual(
      [],
    );
  });
});
