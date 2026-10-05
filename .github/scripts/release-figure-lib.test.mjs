// @ts-check
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildExampleUrl,
  composeFigureHtml,
  examplePathOf,
  figureMarkdown,
  figureOutputPath,
  findUnknownExamples,
  normalizeFigureSpec,
  rawFigureUrl,
  resolveOutputPath,
  themedOutputPath,
} from "./release-figure-lib.mjs";

/** @param {object} overrides */
const spec = (overrides = {}) => ({
  version: "1.2.0",
  name: "rating",
  panels: [{ example: "components/form-controls/rating/max-value" }],
  ...overrides,
});

describe("examplePathOf", () => {
  it("addresses an example by its page's content path plus its name", () => {
    assert.equal(
      examplePathOf(
        "apps/docs/src/content/components/content/heading/examples/badge.tsx",
      ),
      "components/content/heading/badge",
    );
  });
});

describe("buildExampleUrl", () => {
  it("points at the example's stage, tolerating a trailing slash", () => {
    assert.equal(
      buildExampleUrl(
        "http://localhost:3001/",
        "components/content/heading/badge",
      ),
      "http://localhost:3001/example-preview/components/content/heading/badge",
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

  it("rejects a name that would collide with another figure's dark capture", () => {
    assert.throws(
      () => figureOutputPath("1.2.0", "coach-mark-dark"),
      /must not end in -dark/,
    );
  });
});

describe("themedOutputPath", () => {
  it("keeps the spec's path for light and suffixes it for dark", () => {
    const out = "apps/docs/public/assets/releases/1.2.0/coach-mark.png";
    assert.equal(themedOutputPath(out, "light"), out);
    assert.equal(
      themedOutputPath(out, "dark"),
      "apps/docs/public/assets/releases/1.2.0/coach-mark-dark.png",
    );
  });
});

describe("figureMarkdown", () => {
  it("offers the dark capture to dark mode and falls back to light", () => {
    const sha = "c2b3f6ddc658b9b7ac22a685294dab5cc8ab9394";
    const base = `https://raw.githubusercontent.com/mittwald/flow/${sha}/apps/docs/public/assets/releases/1.1.0`;
    assert.equal(
      figureMarkdown({
        sha,
        out: "apps/docs/public/assets/releases/1.1.0/rating.png",
        alt: 'Rating with "maxValue"',
      }),
      [
        "<picture>",
        `  <source media="(prefers-color-scheme: dark)" srcset="${base}/rating-dark.png">`,
        `  <img src="${base}/rating.png" alt="Rating with &quot;maxValue&quot;">`,
        "</picture>",
      ].join("\n"),
    );
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
  it("defaults the output path, width and scale", () => {
    const normalized = normalizeFigureSpec(spec());
    assert.equal(
      normalized.out,
      "apps/docs/public/assets/releases/1.2.0/rating.png",
    );
    assert.equal(normalized.width, 700);
    assert.equal(normalized.scale, 2);
    assert.deepEqual(normalized.panels[0].expect, []);
    assert.equal(normalized.panels[0].caption, null);
  });

  it("requires every panel to name an example", () => {
    assert.throws(
      () => normalizeFigureSpec(spec({ panels: [{}] })),
      /panels\[0\]\.example is required/,
    );
    assert.throws(
      () =>
        normalizeFigureSpec(
          spec({ panels: [{ example: "../../etc/passwd" }] }),
        ),
      /panels\[0\]\.example is required/,
    );
  });

  it("turns a Storybook-era panel away with the way forward", () => {
    // The stories' Star Wars fixtures are why figures come from the docs.
    for (const panel of [
      { story: "form-controls-rating--default" },
      { example: "components/form-controls/rating/max-value", args: { a: 1 } },
      {
        example: "components/form-controls/rating/max-value",
        globals: { theme: "dark" },
      },
    ]) {
      assert.throws(
        () => normalizeFigureSpec(spec({ panels: [panel] })),
        /captured from Styleguide examples now/,
      );
    }
  });

  it("rejects an expectation that asserts nothing", () => {
    assert.throws(
      () =>
        normalizeFigureSpec(
          spec({
            panels: [
              {
                example: "components/form-controls/rating/max-value",
                expect: [{ selector: "input" }],
              },
            ],
          }),
        ),
      /must assert a count or a text/,
    );
  });

  it("rejects an output path the notes could never reference", () => {
    assert.throws(
      () => normalizeFigureSpec(spec({ out: "/tmp/rating.png" })),
      /must be a normalized repo path under apps\/docs\/public\/assets\/releases\//,
    );
  });

  it("does not let a traversal escape the release-assets tree", () => {
    // `startsWith` alone would accept this and then resolve outside the tree.
    assert.throws(
      () =>
        normalizeFigureSpec(
          spec({
            out: "apps/docs/public/assets/releases/1.2.0/../../../../.github/x.png",
          }),
        ),
      /must be a normalized repo path/,
    );
  });

  it("rejects an extension that would lie about the bytes written", () => {
    assert.throws(
      () =>
        normalizeFigureSpec(
          spec({ out: "apps/docs/public/assets/releases/1.2.0/rating.jpg" }),
        ),
      /must end in \.png/,
    );
  });

  it("turns a background away — each theme brings its own ground", () => {
    assert.throws(
      () => normalizeFigureSpec(spec({ background: "#ffffff" })),
      /spec\.background is gone/,
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

describe("resolveOutputPath", () => {
  it("returns the path unchanged when it is already normalized", () => {
    assert.equal(
      resolveOutputPath("apps/docs/public/assets/releases/1.2.0/rating.png"),
      "apps/docs/public/assets/releases/1.2.0/rating.png",
    );
  });

  it("rejects an absolute path, a traversal and a non-png", () => {
    for (const bad of [
      "/etc/passwd.png",
      "apps/docs/public/assets/releases/../../../x.png",
      "apps/docs/public/assets/releases/1.2.0/x.svg",
      "../apps/docs/public/assets/releases/1.2.0/x.png",
    ]) {
      assert.throws(
        () => resolveOutputPath(bad),
        /spec\.out/,
        `accepted ${bad}`,
      );
    }
  });
});

describe("findUnknownExamples", () => {
  const known = [
    "components/form-controls/rating/default",
    "components/form-controls/rating/max-value",
    "components/form-controls/rating/segments",
    "components/status/badge/default",
  ];

  it("passes known example paths", () => {
    assert.deepEqual(
      findUnknownExamples(known, ["components/form-controls/rating/segments"]),
      [],
    );
  });

  it("names the page's examples for a typo in the name", () => {
    const [unknown] = findUnknownExamples(known, [
      "components/form-controls/rating/segment",
    ]);
    assert.equal(unknown.path, "components/form-controls/rating/segment");
    assert.deepEqual(unknown.suggestions, [
      "components/form-controls/rating/default",
      "components/form-controls/rating/max-value",
      "components/form-controls/rating/segments",
    ]);
  });

  it("names the examples of that name for a typo in the page", () => {
    const [unknown] = findUnknownExamples(known, [
      "components/status/badges/default",
    ]);
    assert.deepEqual(unknown.suggestions, [
      "components/form-controls/rating/default",
      "components/status/badge/default",
    ]);
  });
});

describe("composeFigureHtml", () => {
  it("renders one iframe per panel, in order", () => {
    const html = composeFigureHtml({
      width: 500,
      theme: "light",
      panels: [{ caption: "maxValue={10}" }, { caption: null }],
      urls: ["http://localhost:3001/a", "http://localhost:3001/b"],
    });
    assert.match(html, /data-panel="0"[^>]*src="http:\/\/localhost:3001\/a"/);
    assert.match(html, /data-panel="1"[^>]*src="http:\/\/localhost:3001\/b"/);
    assert.equal(html.match(/<iframe/g)?.length, 2);
    assert.equal(html.match(/class="caption"/g)?.length, 1);
    assert.match(html, /#figure \{ width: 500px;/);
  });

  it("escapes a caption instead of letting it become markup", () => {
    const html = composeFigureHtml({
      width: 500,
      theme: "light",
      panels: [{ caption: "<RatingSegment> children" }],
      urls: ["http://localhost:3001/a"],
    });
    assert.match(html, /&lt;RatingSegment&gt; children/);
    assert.ok(!html.includes("<RatingSegment>"));
  });

  it("colors its own ground per theme", () => {
    /** @param {"light" | "dark"} theme */
    const ground = (theme) =>
      composeFigureHtml({
        width: 500,
        theme,
        panels: [{ caption: null }],
        urls: ["http://localhost:3001/a"],
      }).match(/html, body \{[^}]*background: (#[0-9a-f]+);/)?.[1];
    assert.equal(ground("light"), "#ffffff");
    assert.equal(ground("dark"), "#1b1f24");
  });
});
