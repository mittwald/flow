// @ts-check
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildStoryUrl,
  composeFigureHtml,
  encodeStorybookParam,
  figureOutputPath,
  findUnknownStories,
  normalizeFigureSpec,
  rawFigureUrl,
} from "./release-figure-lib.mjs";

/** @param {object} overrides */
const spec = (overrides = {}) => ({
  version: "1.2.0",
  name: "rating",
  panels: [{ story: "form-controls-rating--default" }],
  ...overrides,
});

describe("encodeStorybookParam", () => {
  it("encodes the value kinds Storybook parses back", () => {
    assert.equal(
      encodeStorybookParam({ maxValue: 10, fill: "single", required: true }),
      "maxValue:10;fill:single;required:!true",
    );
  });

  it("rejects a value Storybook would drop from the URL", () => {
    // The whole failure mode this guards: the story still renders, just not in
    // the state that was asked for.
    assert.throws(
      () => encodeStorybookParam({ label: "Cantina rating (optional)" }),
      /Storybook drops it from the URL/,
    );
    assert.throws(
      () => encodeStorybookParam({ "not a key!": "x" }),
      /Storybook drops it from the URL/,
    );
  });

  it("rejects a value kind it cannot encode at all", () => {
    assert.throws(
      () => encodeStorybookParam(/** @type {any} */ ({ items: [1, 2] })),
      /objects and arrays are not supported/,
    );
  });
});

describe("buildStoryUrl", () => {
  it("leaves Storybook's own separators unencoded", () => {
    assert.equal(
      buildStoryUrl("http://localhost:6007", {
        story: "form-controls-rating--default",
        args: { maxValue: 10, fill: "single" },
      }),
      "http://localhost:6007/iframe.html?id=form-controls-rating--default&viewMode=story&args=maxValue:10;fill:single",
    );
  });

  it("omits empty args and globals, and tolerates a trailing slash", () => {
    assert.equal(
      buildStoryUrl("http://localhost:6007/", {
        story: "a--b",
        args: {},
        globals: {},
      }),
      "http://localhost:6007/iframe.html?id=a--b&viewMode=story",
    );
  });

  it("carries globals, which is how a panel selects the dark theme", () => {
    assert.match(
      buildStoryUrl("http://x", { story: "a--b", globals: { theme: "dark" } }),
      /&globals=theme:dark$/,
    );
  });
});

describe("figureOutputPath", () => {
  it("puts the figure inside public/assets, under its version", () => {
    assert.equal(
      figureOutputPath("1.2.0", "coach-mark"),
      "apps/docs/public/assets/releases/1.2.0/coach-mark.png",
    );
  });

  it("rejects a prerelease version and a non-kebab name", () => {
    assert.throws(() => figureOutputPath("1.2.0-next.3", "x"), /x\.y\.z/);
    assert.throws(() => figureOutputPath("1.2.0", "CoachMark"), /kebab-case/);
  });
});

describe("rawFigureUrl", () => {
  it("builds the commit-SHA raw URL the notes reference", () => {
    assert.equal(
      rawFigureUrl(
        "c2b3f6ddc658b9b7ac22a685294dab5cc8ab9394",
        "apps/docs/public/assets/releases/1.1.0/rating.png",
      ),
      "https://raw.githubusercontent.com/mittwald/flow/c2b3f6ddc658b9b7ac22a685294dab5cc8ab9394/apps/docs/public/assets/releases/1.1.0/rating.png",
    );
  });

  it("refuses a branch name — a deleted release branch breaks every URL", () => {
    assert.throws(
      () =>
        rawFigureUrl(
          "release/1.1.0",
          "apps/docs/public/assets/releases/1.1.0/x.png",
        ),
      /expected a commit SHA/,
    );
  });
});

describe("normalizeFigureSpec", () => {
  it("defaults the output path, width, scale and background", () => {
    const normalized = normalizeFigureSpec(spec());
    assert.equal(
      normalized.out,
      "apps/docs/public/assets/releases/1.2.0/rating.png",
    );
    assert.equal(normalized.width, 700);
    assert.equal(normalized.scale, 2);
    assert.equal(normalized.background, "#ffffff");
    assert.deepEqual(normalized.panels[0].args, {});
    assert.equal(normalized.panels[0].caption, null);
  });

  it("requires a panel that drives args to assert what it rendered", () => {
    assert.throws(
      () =>
        normalizeFigureSpec(
          spec({
            panels: [{ story: "a--b", args: { maxValue: 10 } }],
          }),
        ),
      /sets args but asserts nothing/,
    );
    assert.doesNotThrow(() =>
      normalizeFigureSpec(
        spec({
          panels: [
            {
              story: "a--b",
              args: { maxValue: 10 },
              expect: [{ selector: "input", count: 10 }],
            },
          ],
        }),
      ),
    );
  });

  it("rejects an expectation that asserts nothing", () => {
    assert.throws(
      () =>
        normalizeFigureSpec(
          spec({
            panels: [{ story: "a--b", expect: [{ selector: "input" }] }],
          }),
        ),
      /must assert a count or a text/,
    );
  });

  it("rejects an unusable arg before a browser is started", () => {
    assert.throws(
      () =>
        normalizeFigureSpec(
          spec({
            panels: [
              {
                story: "a--b",
                args: { label: "with spaces, and a comma" },
                expect: [{ selector: "input", count: 1 }],
              },
            ],
          }),
        ),
      /Storybook drops it from the URL/,
    );
  });

  it("rejects an output path the notes could never reference", () => {
    assert.throws(
      () => normalizeFigureSpec(spec({ out: "/tmp/rating.png" })),
      /must be a repo path under apps\/docs\/public\/assets\/releases\//,
    );
  });

  it("rejects an out-of-range width and a non-integer scale", () => {
    assert.throws(
      () => normalizeFigureSpec(spec({ width: 4000 })),
      /200\.\.2000/,
    );
    assert.throws(
      () => normalizeFigureSpec(spec({ scale: 1.5 })),
      /must be 1, 2 or 3/,
    );
  });

  it("rejects a spec with no panels", () => {
    assert.throws(() => normalizeFigureSpec(spec({ panels: [] })), /non-empty/);
  });
});

describe("findUnknownStories", () => {
  const index = {
    entries: {
      "form-controls-rating--default": {
        id: "form-controls-rating--default",
        type: "story",
      },
      "form-controls-rating--with-segments": {
        id: "form-controls-rating--with-segments",
        type: "story",
      },
      "form-controls-rating--docs": {
        id: "form-controls-rating--docs",
        type: "docs",
      },
    },
  };

  it("passes known story ids", () => {
    assert.deepEqual(
      findUnknownStories(index, ["form-controls-rating--default"]),
      [],
    );
  });

  it("names the near misses for a typo", () => {
    const [unknown] = findUnknownStories(index, [
      "form-controls-rating--with-segment",
    ]);
    assert.equal(unknown.id, "form-controls-rating--with-segment");
    assert.ok(
      unknown.suggestions.includes("form-controls-rating--with-segments"),
    );
  });

  it("does not offer a docs entry as a story", () => {
    const [unknown] = findUnknownStories(index, ["form-controls-rating--doc"]);
    assert.ok(!unknown.suggestions.includes("form-controls-rating--docs"));
  });
});

describe("composeFigureHtml", () => {
  it("renders one iframe per panel, in order", () => {
    const html = composeFigureHtml({
      width: 500,
      background: "#ffffff",
      panels: [{ caption: "maxValue={10}" }, { caption: null }],
      urls: ["http://localhost:6007/a", "http://localhost:6007/b"],
    });
    assert.match(html, /data-panel="0"[^>]*src="http:\/\/localhost:6007\/a"/);
    assert.match(html, /data-panel="1"[^>]*src="http:\/\/localhost:6007\/b"/);
    assert.equal(html.match(/<iframe/g)?.length, 2);
    assert.equal(html.match(/class="caption"/g)?.length, 1);
    assert.match(html, /#figure \{ width: 500px;/);
  });

  it("escapes a caption instead of letting it become markup", () => {
    const html = composeFigureHtml({
      width: 500,
      background: "#ffffff",
      panels: [{ caption: "<RatingSegment> children" }],
      urls: ["http://localhost:6007/a"],
    });
    assert.match(html, /&lt;RatingSegment&gt; children/);
    assert.ok(!html.includes("<RatingSegment>"));
  });
});
