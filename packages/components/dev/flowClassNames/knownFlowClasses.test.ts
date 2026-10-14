import { describe, expect, test } from "vitest";
import { collectKnownFlowClasses } from "./knownFlowClasses.mjs";

describe("collectKnownFlowClasses", () => {
  const known = collectKnownFlowClasses();

  test("collects a root class with the suffix dropped", () => {
    // `.columnLayout` in ColumnLayout.module.scss — the generator drops a
    // suffix that equals the component name. Getting this wrong is what makes
    // hand-derived names fail silently.
    expect(known).toContain("flow--column-layout");
    expect(known).not.toContain("flow--column-layout--column-layout");
  });

  test("collects a nested class with its component path", () => {
    expect(known).toContain("flow--column-layout--column-layout-container");
    expect(known).toContain("flow--list--list-item-view--bottom-content");
  });

  test("ignores the :global() targets a stub echoes back", () => {
    // A stub lists its stylesheet's `:global()` targets too. Taking a Flow one
    // as a local class would mangle it into a name nothing generates — and
    // would let a broken reference vouch for itself.
    expect(known).not.toContain("flow--list--items--item--flow--avatar");
  });

  test("does not scope a third-party global into a lookalike Flow class", () => {
    // `Calendar.module.scss` styles react-aria's own classes through
    // `:global()`, so its stub lists `react-aria-Heading`. Scoping that as if
    // it were a local class invents `flow--calendar--react-aria-heading`: a
    // name no component generates, but one a typo could plausibly write — and
    // the rule would have waved it through.
    expect(known).not.toContain("flow--calendar--react-aria-heading");
    expect(known).not.toContain("flow--code-editor--cm-editor");
    expect(known).not.toContain(
      "flow--cartesian-chart--recharts-cartesian-grid",
    );
  });

  test("collects classes a mixin produces, which the stylesheet never spells out", () => {
    // `Text.module.scss` emits these through `@include color(dark)`, so only
    // the compiled stub knows about them.
    expect(known).toContain("flow--text--dark-static");
  });
});
