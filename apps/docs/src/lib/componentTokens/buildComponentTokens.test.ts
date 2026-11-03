import { describe, expect, it } from "vitest";
import { buildComponentTokens } from "@/lib/componentTokens/buildComponentTokens";

const token = (path: string, value: string, original = value) => ({
  path: path.split("."),
  value,
  filePath: path.startsWith("size") ? "src/size.yml" : "src/actions/button.yml",
  original: { value: original },
});

describe("buildComponentTokens", () => {
  const light = {
    size: {
      base: token("size.base", "16px"),
      m: token("size.m", "16px", "{size.base}"),
    },
    button: {
      "padding-x": token("button.padding-x", "16px", "{size.m}"),
      height: token("button.height", "calc(16px * 2)", "calc({size.m} * 2)"),
      color: { default: token("button.color.default", "#FFFFFF") },
    },
  };
  const dark = {
    ...light,
    button: {
      ...light.button,
      color: { default: token("button.color.default", "#000000") },
    },
  };

  it("keeps component tokens only, grouped by namespace", () => {
    expect(Object.keys(buildComponentTokens(light, dark))).toEqual(["button"]);
  });

  it("resolves the reference chain and sets the dark value only where it differs", () => {
    expect(buildComponentTokens(light, dark).button).toEqual([
      {
        name: "--button--padding-x",
        light: "16px",
        dark: undefined,
        references: ["--size--m", "--size--base"],
        darkReferences: undefined,
        expression: undefined,
      },
      {
        name: "--button--height",
        light: "calc(16px * 2)",
        dark: undefined,
        references: undefined,
        darkReferences: undefined,
        expression: "calc(var(--size--m) * 2)",
      },
      {
        name: "--button--color--default",
        light: "#FFFFFF",
        dark: "#000000",
        references: undefined,
        darkReferences: undefined,
        expression: undefined,
      },
    ]);
  });

  it("keeps a dark chain where a Semantic token references another Brand step", () => {
    const semantic = (path: string, value: string, original: string) => ({
      ...token(path, value, original),
      filePath: "src/color-semantic.light.yml",
    });
    const brand = {
      "blue-100": token("color.blue-100", "#EEF", "#EEF"),
      "blue-900": token("color.blue-900", "#113", "#113"),
    };
    const themed = (step: string, value: string) => ({
      color: { ...brand },
      surface: semantic("surface", value, `{color.${step}}`),
      card: { background: token("card.background", value, "{surface}") },
    });

    expect(
      buildComponentTokens(
        themed("blue-100", "#EEF"),
        themed("blue-900", "#113"),
      ).card,
    ).toEqual([
      {
        name: "--card--background",
        light: "#EEF",
        dark: "#113",
        references: ["--surface", "--color--blue-100"],
        darkReferences: ["--surface", "--color--blue-900"],
        expression: undefined,
      },
    ]);
  });
});
