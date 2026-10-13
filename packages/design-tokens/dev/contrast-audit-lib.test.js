// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  auditTheme,
  backdropFor,
  backgroundNameFor,
  checkAllowlist,
  composite,
  contrastRatio,
  findPairs,
  findSurfaceChecks,
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
  assert.equal(backgroundNameFor("elevation.color.100"), null);
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
    ["elevation.color.100", "#FFFFFF"],
    ["content.color.300", "#000000"],
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

test("findSurfaceChecks rates single colors on the surfaces they render on", () => {
  const checks = findSurfaceChecks([
    "elevation.color.100",
    "layout-card.background-color",
    "list-item.background-color.default",
    "list-item.background-color.pressed",
    "accent-box.background-color-blue",
    "accent-box.background-color-gradient",
    "text.color.default",
    "text.color.light-static",
    "text.color.disabled",
    "focus.outline-color",
    "notification.info-heading-color",
    "notification.info-background-color.default",
    "notification.danger-background-color.default",
  ]);
  const on = (/** @type {string} */ content) =>
    checks.filter((c) => c.content === content).map((c) => c.background);

  assert.deepEqual(on("text.color.default"), [
    "elevation.color.100",
    "layout-card.background-color",
    "list-item.background-color.default",
    "list-item.background-color.pressed",
    "accent-box.background-color-blue",
    "notification.info-background-color.default",
    "notification.danger-background-color.default",
  ]);
  // Fields and the focus ring sit on containers at rest only
  assert.ok(
    !on("focus.outline-color").includes("list-item.background-color.pressed"),
  );
  assert.equal(
    checks.find((c) => c.content === "focus.outline-color")?.kind,
    "ui",
  );
  // A notification heading sits on its own status background
  assert.deepEqual(on("notification.info-heading-color"), [
    "notification.info-background-color.default",
  ]);
  // Contextual colors on their ideal backdrop only
  assert.deepEqual(on("text.color.light-static"), ["(black)"]);
  assert.ok(
    checks
      .filter((c) => c.content === "text.color.disabled")
      .every((c) => c.exempt),
  );
});

test("auditTheme rates a surface check, a backdrop-only one included", () => {
  const tokens = new Map([
    ["elevation.color.100", "#FFFFFF"],
    ["content.color.300", "#000000"],
    ["layout-card.background-color", "#FFFFFF"],
    ["icon.color", "#949494"],
    ["text.color.light-static", "rgb(255 255 255 / 50%)"],
  ]);
  const results = auditTheme(tokens, "light");
  const icon = results.find(
    (r) =>
      r.content === "icon.color" &&
      r.background === "layout-card.background-color",
  );
  assert.equal(icon?.status, "pass");
  const light = results.find((r) => r.content === "text.color.light-static");
  assert.equal(light?.background, "(black)");
  assert.equal(light?.colors?.background, "#000000");
  assert.equal(light?.colors?.content, "#808080");
});

test("checkAllowlist reports unlisted, worse and stale entries", () => {
  /** @type {any[]} */
  const results = [
    {
      theme: "light",
      content: "a",
      background: "x",
      ratio: 4.2,
      status: "large-only",
    },
    {
      theme: "light",
      content: "b",
      background: "x",
      ratio: 2.5,
      status: "fail",
    },
    {
      theme: "light",
      content: "c",
      background: "x",
      ratio: 3.9,
      status: "large-only",
    },
    { theme: "light", content: "d", background: "x", ratio: 5, status: "pass" },
  ];
  const { unlisted, worse, stale } = checkAllowlist(results, [
    {
      reason: "known",
      pairs: {
        "light a on x": 4.2,
        "light b on x": 2.6,
        "light d on x": 4.4,
      },
    },
  ]);
  assert.deepEqual(
    unlisted.map((r) => r.content),
    ["c"],
  );
  assert.deepEqual(
    worse.map((r) => r.content),
    ["b"],
  );
  assert.deepEqual(stale, ["light d on x"]);
  assert.throws(() =>
    checkAllowlist(results, [
      { reason: "one", pairs: { "light a on x": 4.2 } },
      { reason: "two", pairs: { "light a on x": 4.2 } },
    ]),
  );
});
