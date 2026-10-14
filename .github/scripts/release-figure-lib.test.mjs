// @ts-check
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  applyReplacements,
  buildExampleUrl,
  composeFigureHtml,
  examplePathOf,
  exampleSourcePath,
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
  example: "components/form-controls/rating/max-value",
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

describe("exampleSourcePath", () => {
  it("finds the source file an example path names", () => {
    const file =
      "apps/docs/src/content/components/content/heading/examples/badge.tsx";
    assert.equal(exampleSourcePath(examplePathOf(file)), file);
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
        width: 360,
      }),
      [
        "<picture>",
        `  <source media="(prefers-color-scheme: dark)" srcset="${base}/rating-dark.png">`,
        `  <img src="${base}/rating.png" alt="Rating with &quot;maxValue&quot;" width="360">`,
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
  it("defaults the output path, width, scale, expectations and replacements", () => {
    const normalized = normalizeFigureSpec(spec());
    assert.equal(
      normalized.out,
      "apps/docs/public/assets/releases/1.2.0/rating.png",
    );
    assert.equal(normalized.width, 700);
    assert.equal(normalized.scale, 2);
    assert.equal(
      normalized.example,
      "components/form-controls/rating/max-value",
    );
    assert.deepEqual(normalized.expect, []);
    assert.deepEqual(normalized.replace, {});
  });

  it("requires an example", () => {
    assert.throws(
      () => normalizeFigureSpec(spec({ example: undefined })),
      /spec\.example is required/,
    );
    assert.throws(
      () => normalizeFigureSpec(spec({ example: "../../etc/passwd" })),
      /spec\.example is required/,
    );
  });

  it("turns panels and captions away — one example per figure", () => {
    assert.throws(
      () =>
        normalizeFigureSpec({
          version: "1.2.0",
          name: "rating",
          panels: [{ example: "components/form-controls/rating/max-value" }],
        }),
      /spec\.panels is gone .* two figures/,
    );
    assert.throws(
      () => normalizeFigureSpec(spec({ caption: "maxValue={10}" })),
      /spec\.caption is gone/,
    );
  });

  it("turns a Storybook-era spec away with the way forward", () => {
    // The stories' Star Wars fixtures are why figures come from the docs.
    for (const fields of [
      { story: "form-controls-rating--default" },
      { args: { a: 1 } },
      { globals: { theme: "dark" } },
    ]) {
      assert.throws(
        () => normalizeFigureSpec(spec(fields)),
        /captured from Styleguide examples/,
      );
    }
  });

  it("rejects an expectation that asserts nothing", () => {
    assert.throws(
      () => normalizeFigureSpec(spec({ expect: [{ selector: "input" }] })),
      /must assert a count or a text/,
    );
  });

  it("rejects a replace map that is not string to string", () => {
    assert.throws(
      () => normalizeFigureSpec(spec({ replace: [["a", "b"]] })),
      /spec\.replace must be an object/,
    );
    assert.throws(
      () => normalizeFigureSpec(spec({ replace: { Speichern: 1 } })),
      /must be a string/,
    );
    assert.throws(
      () => normalizeFigureSpec(spec({ replace: { " ": "x" } })),
      /must not be empty/,
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
});

describe("applyReplacements", () => {
  it("translates visible strings and reports nothing unmatched", () => {
    assert.deepEqual(
      applyReplacements("<Button>Speichern</Button>\n<Text>Hallo</Text>", {
        Speichern: "Save",
        Hallo: "Hello",
      }),
      {
        source: "<Button>Save</Button>\n<Text>Hello</Text>",
        unmatched: [],
      },
    );
  });

  it("matches a phrase prettier wrapped across lines", () => {
    const source = [
      "<Text>",
      "  Die Daten werden geladen, bitte",
      "  warten.",
      "</Text>",
    ].join("\n");
    assert.equal(
      applyReplacements(source, {
        "Die Daten werden geladen, bitte warten.": "Loading the data.",
      }).source,
      "<Text>\n  Loading the data.\n</Text>",
    );
  });

  it("tolerates a line break before a `>` but not two words run together", () => {
    const source =
      "<Switch\n  onChange={setIsLoading}\n>\n  Ladezustand anzeigen\n</Switch>";
    assert.equal(
      applyReplacements(source, {
        "<Switch onChange={setIsLoading} > Ladezustand anzeigen </Switch>": "",
      }).source,
      "",
    );
    assert.deepEqual(
      applyReplacements("Ladezustandanzeigen", {
        "Ladezustand anzeigen": "Show loading state",
      }).unmatched,
      ["Ladezustand anzeigen"],
    );
  });

  it("lets the longest key win and never replaces a replacement", () => {
    assert.equal(
      applyReplacements("Neues Projekt und Projekt", {
        Projekt: "Project",
        "Neues Projekt": "New Projekt",
      }).source,
      "New Projekt und Project",
    );
  });

  it("does not match a word inside a longer one", () => {
    const { source, unmatched } = applyReplacements("Projekte", {
      Projekt: "Project",
    });
    assert.equal(source, "Projekte");
    assert.deepEqual(unmatched, ["Projekt"]);
  });

  it("changes initial state and strips a demo-only control", () => {
    const source = [
      "const [isLoading, setIsLoading] = useState(true);",
      "<Switch isSelected={isLoading} onChange={setIsLoading}>",
      "  Ladezustand anzeigen",
      "</Switch>",
      "<SkeletonMode isEnabled={isLoading} />",
    ].join("\n");
    assert.equal(
      applyReplacements(source, {
        "const [isLoading, setIsLoading] = useState(true);":
          "const isLoading = false;",
        "<Switch isSelected={isLoading} onChange={setIsLoading}> Ladezustand anzeigen </Switch>":
          "",
      }).source,
      "const isLoading = false;\n\n<SkeletonMode isEnabled={isLoading} />",
    );
  });

  it("reports every key that matches nothing", () => {
    assert.deepEqual(
      applyReplacements("<Text>Hallo</Text>", {
        Hallo: "Hello",
        Tschüss: "Bye",
      }).unmatched,
      ["Tschüss"],
    );
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

  it("rejects a path that would collide with a dark capture", () => {
    assert.throws(
      () =>
        resolveOutputPath(
          "apps/docs/public/assets/releases/1.2.0/coach-mark-dark.png",
        ),
      /must not end in -dark\.png/,
    );
  });

  it("rejects it whether it comes from `out` or from `name`", () => {
    for (const fields of [
      { name: "coach-mark-dark" },
      { out: "apps/docs/public/assets/releases/1.2.0/coach-mark-dark.png" },
    ]) {
      assert.throws(
        () => normalizeFigureSpec(spec(fields)),
        /must not end in -dark\.png/,
        `accepted ${JSON.stringify(fields)}`,
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
  it("frames the example in one iframe at the figure's width", () => {
    const html = composeFigureHtml({
      width: 500,
      theme: "light",
      url: "http://localhost:3001/a?b=1&c=2",
    });
    assert.equal(html.match(/<iframe/g)?.length, 1);
    assert.match(
      html,
      /id="example" src="http:\/\/localhost:3001\/a\?b=1&amp;c=2"/,
    );
    assert.match(html, /#figure \{ width: 500px;/);
  });

  it("colors its own ground per theme", () => {
    /** @param {"light" | "dark"} theme */
    const ground = (theme) =>
      composeFigureHtml({
        width: 500,
        theme,
        url: "http://localhost:3001/a",
      }).match(/html, body \{[^}]*background: (#[0-9a-f]+);/)?.[1];
    assert.equal(ground("light"), "#ffffff");
    assert.equal(ground("dark"), "#1b1f24");
  });
});
