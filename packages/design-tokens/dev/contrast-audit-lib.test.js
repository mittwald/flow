// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  auditTheme,
  backdropFor,
  backgroundNameFor,
  composite,
  contrastRatio,
  findPairs,
  parseColor,
} from "./contrast-audit-lib.js";

const ratio = (/** @type {string} */ a, /** @type {string} */ b) =>
  contrastRatio(
    /** @type {any} */ (parseColor(a)),
    /** @type {any} */ (parseColor(b)),
  );

test("parseColor reads the formats the token build emits", () => {
  assert.deepEqual(parseColor("#FFF"), { r: 255, g: 255, b: 255, a: 1 });
  assert.deepEqual(parseColor("#0054F5"), { r: 0, g: 84, b: 245, a: 1 });
  assert.deepEqual(parseColor("#00000080")?.a, 128 / 255);
  assert.deepEqual(parseColor("rgb(0 0 0 / 12.5%)"), {
    r: 0,
    g: 0,
    b: 0,
    a: 0.125,
  });
  assert.deepEqual(parseColor("rgba(255, 255, 255, 0.5)"), {
    r: 255,
    g: 255,
    b: 255,
    a: 0.5,
  });
  assert.equal(parseColor("transparent")?.a, 0);
  assert.equal(parseColor("linear-gradient(90deg, #fff, #000)"), null);
});

test("contrastRatio matches the WCAG reference values", () => {
  assert.equal(ratio("#FFFFFF", "#000000"), 21);
  assert.equal(ratio("#777777", "#777777"), 1);
  // #767676 is the classic lightest gray that passes 4.5:1 on white
  assert.ok(ratio("#767676", "#FFFFFF") >= 4.5);
  assert.ok(ratio("#777777", "#FFFFFF") < 4.5);
});

test("composite blends a translucent color onto an opaque one", () => {
  const white = /** @type {any} */ (parseColor("#FFFFFF"));
  const half = /** @type {any} */ (parseColor("rgb(0 0 0 / 50%)"));
  assert.deepEqual(composite(half, white), {
    r: 127.5,
    g: 127.5,
    b: 127.5,
    a: 1,
  });
  const none = /** @type {any} */ (parseColor("transparent"));
  assert.deepEqual(composite(none, white), white);
});

test("backgroundNameFor swaps the content part of the last segment", () => {
  assert.equal(
    backgroundNameFor("primary-solid-content-color"),
    "primary-solid-background-color",
  );
  assert.equal(
    backgroundNameFor("badge.blue-scope-content-color"),
    "badge.blue-scope-background-color",
  );
  assert.equal(
    backgroundNameFor("decorative.teal-content-accent-color"),
    "decorative.teal-background-color",
  );
  assert.equal(backgroundNameFor("tooltip.color"), "tooltip.background-color");
  assert.equal(
    backgroundNameFor("header-navigation.color-dark"),
    "header-navigation.background-color-dark",
  );
  assert.equal(
    backgroundNameFor("menu-item.icon-color"),
    "menu-item.background-color",
  );
  assert.equal(backgroundNameFor("menu-item.background-color"), null);
  assert.equal(backgroundNameFor("badge.blue-border-color"), null);
  assert.equal(backgroundNameFor("neutral.color.100"), null);
});

test("backdropFor reads the dark/light context from the name", () => {
  assert.equal(backdropFor("primary-plain-content-color"), "surface");
  assert.equal(backdropFor("dark-soft-content-color"), "surface");
  assert.equal(backdropFor("light-soft-content-color"), "inverse-surface");
  assert.equal(backdropFor("link.color-light-static"), "black");
  assert.equal(backdropFor("button.dark-static-plain-content-color"), "white");
});

test("findPairs pairs states and falls back to default", () => {
  const pairs = findPairs([
    "x-solid-background-color.default",
    "x-solid-background-color.hover",
    "x-solid-content-color",
    "button.x-solid-background-color.default",
    "button.x-solid-background-color.disabled",
    "button.x-solid-content-color.default",
    "button.x-solid-content-color.disabled",
    "lonely-content-color",
  ]);
  assert.deepEqual(
    pairs.map((p) => [p.content, p.background, p.state, p.exempt]),
    [
      [
        "x-solid-content-color",
        "x-solid-background-color.default",
        "default",
        false,
      ],
      [
        "x-solid-content-color",
        "x-solid-background-color.hover",
        "hover",
        false,
      ],
      [
        "button.x-solid-content-color.default",
        "button.x-solid-background-color.default",
        "default",
        false,
      ],
      [
        "button.x-solid-content-color.disabled",
        "button.x-solid-background-color.disabled",
        "disabled",
        true,
      ],
    ],
  );
});

test("auditTheme composites alpha on the surface and rates the pair", () => {
  const tokens = new Map([
    ["neutral.color.100", "#FFFFFF"],
    ["neutral.color.1200", "#000000"],
    ["a-plain-background-color", "transparent"],
    ["a-plain-content-color", "#777777"],
    ["b-soft-background-color", "rgb(0 0 0 / 50%)"],
    ["b-soft-content-color", "#000000"],
    ["menu-item.icon-color", "#949494"],
    ["menu-item.background-color", "#FFFFFF"],
  ]);
  const byName = Object.fromEntries(
    auditTheme(tokens, "light").map((r) => [r.name, r]),
  );
  assert.equal(byName["a-plain-content-color"].status, "large-only");
  assert.equal(byName["a-plain-content-color"].colors?.background, "#FFFFFF");
  assert.equal(byName["b-soft-content-color"].colors?.background, "#808080");
  assert.equal(byName["menu-item.icon-color"].kind, "ui");
  assert.equal(byName["menu-item.icon-color"].status, "pass");
});
