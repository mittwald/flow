// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  isPublishRelevant,
  classifyChangedFiles,
  classifyManifestChange,
} from "./release-relevance-lib.mjs";

test("isPublishRelevant: docs, CI and tooling paths are irrelevant", () => {
  for (const path of [
    ".github/workflows/publish.yml",
    ".github/scripts/release-relevance-lib.mjs",
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    "apps/docs/src/content/components/button.mdx",
    "apps/remote-dom-demo/src/App.tsx",
    "docs/adr/0005-semver-contract.md",
    "docs/remote-ui.md",
    "dev/deploy-review.ts",
    ".idea/vcs.xml",
    ".vscode/settings.json",
    ".claude/settings.json",
    "README.md",
    "AGENTS.md",
    "CLAUDE.md",
    "CHANGELOG.md",
    "CONTRIBUTE.md",
    "LICENSE",
    ".prettierrc.json",
    ".prettierignore",
    ".stylelintignore",
    ".gitattributes",
    ".gitignore",
    ".dockerignore",
  ]) {
    assert.equal(isPublishRelevant(path), false, path);
  }
});

test("isPublishRelevant: anything reaching a tarball is relevant", () => {
  for (const path of [
    "packages/components/src/components/Button/Button.tsx",
    "packages/components/src/components/Button/Button.module.scss",
    "packages/components/src/components/Button/locales/de-DE.locale.json",
    "packages/design-tokens/src/color.yaml",
    "packages/remote-core/src/index.ts",
    "packages/components/package.json",
    "packages/components/project.json",
    "packages/components/vite.config.ts",
  ]) {
    assert.equal(isPublishRelevant(path), true, path);
  }
});

test("isPublishRelevant: Markdown INSIDE packages is relevant", () => {
  // @mittwald/flow-react-components ships AGENTS.md, MIGRATION.md and USAGE.md
  // next to `dist` — a package-local Markdown file really can be part of the
  // published artifact.
  assert.equal(isPublishRelevant("packages/components/README.md"), true);
  assert.equal(isPublishRelevant("packages/components/AGENTS.md"), true);
  assert.equal(isPublishRelevant("packages/components/MIGRATION.md"), true);
});

test("isPublishRelevant: build wiring and dependencies stay relevant", () => {
  for (const path of [
    "package.json",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    "nx.json",
    "lerna.json",
    "eslint.config.js",
    "stylelint.config.mjs",
    "patches/@sigstore__sign@4.1.1.patch",
  ]) {
    assert.equal(isPublishRelevant(path), true, path);
  }
});

test("isPublishRelevant: unknown paths are relevant (fail-safe denylist)", () => {
  assert.equal(isPublishRelevant("packages/brand-new/src/index.ts"), true);
  assert.equal(isPublishRelevant("new-top-level-dir/thing.ts"), true);
  assert.equal(isPublishRelevant("some-new-root-file.ts"), true);
});

test("classifyChangedFiles: an undeterminable file list publishes", () => {
  assert.equal(classifyChangedFiles([]).publish, true);
  assert.equal(classifyChangedFiles(["", "  "]).publish, true);
});

test("classifyChangedFiles: docs-only and CI-only pushes do not publish", () => {
  // #2870 "docs: fix heading spacing" → 0.2.0-alpha.1044
  assert.equal(
    classifyChangedFiles([
      "apps/docs/src/content/foundations/typography.mdx",
      "apps/docs/src/app/globals.css",
    ]).publish,
    false,
  );
  // #2906 "chore(ci): purge CODEOWNERS def" → 0.2.0-alpha.1055
  assert.equal(
    classifyChangedFiles([".github/CODEOWNERS", ".github/workflows/test.yml"])
      .publish,
    false,
  );
  // #2873 "chore(docs): correct lint git hook to pre-push" → 0.2.0-alpha.1049
  assert.equal(classifyChangedFiles(["AGENTS.md"]).publish, false);
});

test("classifyChangedFiles: a mixed push publishes", () => {
  const result = classifyChangedFiles([
    "apps/docs/src/content/components/button.mdx",
    ".github/workflows/test.yml",
    "packages/components/src/components/Button/Button.tsx",
  ]);
  assert.equal(result.publish, true);
  assert.deepEqual(result.relevant, [
    "packages/components/src/components/Button/Button.tsx",
  ]);
  assert.equal(result.total, 3);
});

test("classifyChangedFiles: a promotion merge publishes", () => {
  // A release/x.y.0 -> main promotion carries the version bump and changelogs.
  // `packages/*/package.json` is relevant, so the graduation always publishes.
  assert.equal(
    classifyChangedFiles([
      "lerna.json",
      "CHANGELOG.md",
      "packages/components/package.json",
      "packages/components/CHANGELOG.md",
    ]).publish,
    true,
  );
});

test("classifyChangedFiles: the reason names the counts", () => {
  assert.match(
    classifyChangedFiles(["apps/docs/a.mdx", "docs/b.md"]).reason,
    /all 2 changed file\(s\) are non-shipping/,
  );
  assert.match(
    classifyChangedFiles(["apps/docs/a.mdx", "packages/components/src/a.ts"])
      .reason,
    /1 of 2 changed file\(s\) affect published packages/,
  );
});

test("classifyChangedFiles: a skip names the rules that fired", () => {
  // The AC asks for a `::notice::` that says WHICH rule skipped the release,
  // so the rule labels are part of the classifier's output, not log prose.
  const result = classifyChangedFiles(
    [
      "apps/docs/a.mdx",
      "packages/components/.storybook/preview.tsx",
      "packages/components/src/components/Button/stories/Default.stories.tsx",
      "packages/components/package.json",
    ],
    { manifestRelevance: { "packages/components/package.json": false } },
  );
  assert.equal(result.publish, false);
  assert.deepEqual(result.rules, [
    'filename "*.stories.tsx"',
    'manifest key diff "packages/components/package.json"',
    'package-local "packages/*/.storybook/"',
    'top-level "apps/"',
  ]);
  for (const rule of result.rules) assert.ok(result.reason.includes(rule));
});

test("classifyChangedFiles: a non-path input publishes instead of being classified", () => {
  // `gh api` prints the error body to stdout on a non-2xx; it must never be
  // mistaken for a filename.
  const result = classifyChangedFiles([
    '{"message":"Not Found","status":"404"}',
  ]);
  assert.equal(result.publish, true);
  assert.match(result.reason, /not a list of paths/);
  assert.deepEqual(result.relevant, []);
});

test("classifyChangedFiles: square brackets are legitimate path characters", () => {
  // Next.js dynamic routes in the docs app — docs-only, must still skip.
  assert.equal(
    classifyChangedFiles([
      "apps/docs/src/app/components/[group]/[component]/develop/page.tsx",
      "apps/docs/src/app/get-started/[...slug]/page.tsx",
    ]).publish,
    false,
  );
});

test("classifyManifestChange: a scripts-only change is irrelevant", () => {
  // #2970 "test(docs): check the documentation's internal links in CI" → 1.0.9
  const before = JSON.stringify({
    name: "root",
    scripts: { test: "nx run-many --targets=test:unit,test:compile" },
    devDependencies: { vite: "7.0.0" },
  });
  const after = JSON.stringify({
    name: "root",
    scripts: {
      test: "nx run-many --targets=test:unit,test:compile,test:links",
    },
    devDependencies: { vite: "7.0.0" },
  });
  assert.equal(classifyManifestChange(before, after).relevant, false);
});

test("classifyManifestChange: dependency and wiring keys stay relevant", () => {
  const base = { scripts: { test: "a" }, devDependencies: { vite: "7.0.0" } };
  for (const [key, value] of [
    ["devDependencies", { vite: "7.1.0" }],
    ["dependencies", { react: "19.2.0" }],
    ["resolutions", { react: "19.2.0" }],
    ["packageManager", "pnpm@10.28.3"],
    ["workspaces", ["packages/*"]],
    ["type", "commonjs"],
    ["engines", { node: ">=26" }],
    ["version", "1.0.9"],
    ["brandNewKey", { a: 1 }],
  ]) {
    const after = JSON.stringify({ ...base, [key]: value });
    assert.equal(
      classifyManifestChange(JSON.stringify(base), after).relevant,
      true,
      key,
    );
  }
});

test("classifyManifestChange: unparsable or unknown content is relevant", () => {
  assert.equal(classifyManifestChange("{ not json", "{}").relevant, true);
  assert.equal(classifyManifestChange(null, "{}").relevant, true);
  assert.equal(classifyManifestChange("{}", undefined).relevant, true);
});

test("classifyChangedFiles: a scripts-only root manifest does not publish", () => {
  // #2970: apps/docs/**, a workflow, and two npm scripts.
  const result = classifyChangedFiles(
    [
      "apps/docs/src/lib/links/checkLinks.ts",
      "apps/docs/package.json",
      ".github/workflows/test.yml",
      "package.json",
    ],
    { manifestRelevance: { "package.json": false } },
  );
  assert.equal(result.publish, false);
  assert.deepEqual(result.relevant, []);
});

test("classifyChangedFiles: an unclassified root manifest still publishes", () => {
  for (const options of [
    undefined,
    {},
    { manifestRelevance: {} },
    { manifestRelevance: { "package.json": true } },
  ]) {
    assert.equal(
      classifyChangedFiles(["apps/docs/a.mdx", "package.json"], options)
        .publish,
      true,
    );
  }
});

test("classifyChangedFiles: a lockfile follows the manifests that moved it", () => {
  // #2959 "docs: upgrade fumadocs-mdx" → 1.0.4. The lock churn belongs to an
  // importer that is never published.
  assert.equal(
    classifyChangedFiles(["apps/docs/package.json", "pnpm-lock.yaml"]).publish,
    false,
  );
  // A published package's own dependency bump keeps the lockfile relevant.
  assert.equal(
    classifyChangedFiles(["packages/components/package.json", "pnpm-lock.yaml"])
      .publish,
    true,
  );
  // The root manifest counts as a manifest — and only when it is relevant.
  assert.equal(
    classifyChangedFiles(["package.json", "pnpm-lock.yaml"], {
      manifestRelevance: { "package.json": false },
    }).publish,
    false,
  );
  assert.equal(
    classifyChangedFiles(["package.json", "pnpm-lock.yaml"], {
      manifestRelevance: { "package.json": true },
    }).publish,
    true,
  );
  // Same for a PACKAGE manifest: a scripts-only diff cannot have moved the
  // lockfile, so the lock churn has nothing relevant left to follow.
  assert.equal(
    classifyChangedFiles(
      ["packages/components/package.json", "pnpm-lock.yaml"],
      { manifestRelevance: { "packages/components/package.json": false } },
    ).publish,
    false,
  );
});

test("classifyChangedFiles: unexplained lock churn publishes (fail-safe)", () => {
  // No manifest changed at all — a dedupe or resolution refresh can move what a
  // published package bundles, and nothing in the path list says otherwise.
  assert.equal(classifyChangedFiles(["pnpm-lock.yaml"]).publish, true);
  assert.equal(
    classifyChangedFiles(["pnpm-workspace.yaml", "pnpm-lock.yaml"]).publish,
    true,
  );
  assert.equal(
    classifyChangedFiles(["patches/foo@1.0.0.patch", "pnpm-lock.yaml"]).publish,
    true,
  );
});

test("isPublishRelevant: package-local non-shipping directories are irrelevant", () => {
  for (const path of [
    // #3010 → 1.0.14. The Storybook config is never built into `dist`.
    "packages/components/.storybook/preview.tsx",
    "packages/components/.storybook/main.ts",
    "packages/remote-react-components/e2e/remote-test-server/vitest.config.ts",
    "packages/remote-react-components/src/tests/visual/lib/scenarios.ts",
    "packages/remote-react-components/src/tests/visual/__screenshots__/a.png",
    "packages/components/src/tests/layered/thirdParty.ts",
    // #3006 → 1.0.12. The cross-version harness and the vitest setup files run
    // only under vitest.
    "packages/remote-react-components/dev/cross-version/run.ts",
    "packages/components/dev/vitest/setupBrowser.ts",
  ]) {
    assert.equal(isPublishRelevant(path), false, path);
  }
});

test("isPublishRelevant: stories and tests are irrelevant wherever they sit", () => {
  for (const path of [
    "packages/components/src/components/Button/stories/Default.stories.tsx",
    "packages/components/src/lib/react/dynamic.test.ts",
    "packages/components/src/components/Button/Button.browser.test.tsx",
    "packages/components/dev/vite/layerOrderPlugin.test.ts",
    // `.test.` is not always the last extension.
    "packages/remote-react-components/e2e/tests/Button.browser.test.remote.tsx",
  ]) {
    assert.equal(isPublishRelevant(path), false, path);
  }
});

test("isPublishRelevant: package-local build tooling in dev/ stays relevant", () => {
  // `packages/*/dev/**` is NOT irrelevant wholesale: in `components` and
  // `codemods` that directory IS the build. Only the test-harness subtrees are
  // denylisted, so these four keep publishing.
  for (const path of [
    // Imported by vite.build.config.ts — changes the emitted CSS.
    "packages/components/dev/vite/layerOrderPlugin.ts",
    // Generates the shipped dist/assets/doc-properties.json.
    "packages/components/dev/createDocPropertiesJson.ts",
    // Generates view.ts / src/auto-generated/**.
    "packages/components/dev/remote-components-generator/lib/propClassifiers.ts",
    // `codemods`' build script is `tsx dev/generateCli.ts && …`.
    "packages/codemods/dev/generateCli.ts",
  ]) {
    assert.equal(isPublishRelevant(path), true, path);
  }
});

test("isPublishRelevant: a package's CONTRIBUTE.md never ships", () => {
  // No package lists it in `files`, and npm force-includes only README and
  // LICENSE — guarded by "every published package ships …" below.
  assert.equal(
    isPublishRelevant("packages/remote-react-components/CONTRIBUTE.md"),
    false,
  );
});

test("isPublishRelevant: the package-local rules need a full path segment", () => {
  for (const path of [
    // A prefix, not a segment.
    "packages/components/src/testsWithoutSlash.ts",
    "packages/components/e2e-helpers/serve.ts",
    "packages/components/development/thing.ts",
    // `dev/` other than the two harness subtrees.
    "packages/components/dev/icons/generate.ts",
    "packages/components/dev/scss-types/generateScssTypes.ts",
    // The rules are package-local: the same names OUTSIDE packages/ are
    // unknown paths, and unknown means relevant.
    "src/tests/a.ts",
    "e2e/a.ts",
    ".storybook/main.ts",
  ]) {
    assert.equal(isPublishRelevant(path), true, path);
  }
});

test("classifyChangedFiles: 1.0.14 — a Storybook-only push does not publish", () => {
  // #3010 "build(components): silence the Storybook a11y addon".
  const result = classifyChangedFiles([
    "packages/components/.storybook/preview.tsx",
  ]);
  assert.equal(result.publish, false);
  assert.deepEqual(result.relevant, []);
});

test("classifyChangedFiles: 1.0.12 — a package-local tooling push does not publish", () => {
  // #3006 "ci(remote-react-components): select both unit projects": a
  // scripts-only package manifest, a package-local CONTRIBUTE.md, the
  // cross-version harness and the visual-test sources.
  const result = classifyChangedFiles(
    [
      "packages/remote-react-components/package.json",
      "packages/remote-react-components/CONTRIBUTE.md",
      "packages/remote-react-components/dev/cross-version/crossVersionRunner.ts",
      "packages/remote-react-components/src/tests/visual/lib/scenarios.ts",
    ],
    {
      manifestRelevance: {
        "packages/remote-react-components/package.json": false,
      },
    },
  );
  assert.equal(result.publish, false);
  assert.deepEqual(result.relevant, []);
});

test("classifyChangedFiles: a mixed package-local push publishes", () => {
  // One source file among the non-shipping ones is enough — the mixed case must
  // never be swallowed.
  const result = classifyChangedFiles(
    [
      "packages/components/.storybook/preview.tsx",
      "packages/components/src/components/Button/stories/Default.stories.tsx",
      "packages/components/src/tests/layered/thirdParty.ts",
      "packages/remote-react-components/package.json",
      "packages/components/src/components/Button/Button.tsx",
    ],
    {
      manifestRelevance: {
        "packages/remote-react-components/package.json": false,
      },
    },
  );
  assert.equal(result.publish, true);
  assert.deepEqual(result.relevant, [
    "packages/components/src/components/Button/Button.tsx",
  ]);
});

test("classifyChangedFiles: a package manifest dependency bump publishes", () => {
  for (const options of [
    undefined,
    { manifestRelevance: { "packages/components/package.json": true } },
  ]) {
    assert.equal(
      classifyChangedFiles(["packages/components/package.json"], options)
        .publish,
      true,
    );
  }
});

test("classifyManifestChange: a package manifest is judged the same way", () => {
  // #3006 changed only `test:unit` in remote-react-components' manifest.
  const path = "packages/remote-react-components/package.json";
  const before = JSON.stringify({
    name: "@mittwald/flow-remote-react-components",
    scripts: { "test:unit": "vitest run --project=unit" },
    dependencies: { "@quilted/threads": "3.0.0" },
  });
  const scriptsOnly = JSON.stringify({
    name: "@mittwald/flow-remote-react-components",
    scripts: { "test:unit": "vitest run --project=unit*" },
    dependencies: { "@quilted/threads": "3.0.0" },
  });
  const dependencyBump = JSON.stringify({
    name: "@mittwald/flow-remote-react-components",
    scripts: { "test:unit": "vitest run --project=unit" },
    dependencies: { "@quilted/threads": "3.1.0" },
  });

  assert.equal(
    classifyManifestChange(before, scriptsOnly, path).relevant,
    false,
  );
  assert.equal(
    classifyManifestChange(before, dependencyBump, path).relevant,
    true,
  );
  // The reason names the manifest, so a run with several of them stays readable.
  assert.match(
    classifyManifestChange(before, scriptsOnly, path).reason,
    /packages\/remote-react-components\/package\.json/,
  );
  assert.match(
    classifyManifestChange(before, before).reason,
    /root package\.json/,
  );
});

test("every published package ships only dist and shipped Markdown", () => {
  // The invariant the package-local denylist rests on. If a package ever starts
  // shipping `src`, `.storybook`, `e2e` or CONTRIBUTE.md, this fails and the
  // denylist has to be revisited — the classifier itself cannot notice.
  const packagesDir = join(import.meta.dirname, "..", "..", "packages");
  const neverShipped = new Set(["CONTRIBUTE.md"]);
  let checked = 0;

  for (const name of readdirSync(packagesDir)) {
    let manifest;
    try {
      manifest = JSON.parse(
        readFileSync(join(packagesDir, name, "package.json"), "utf8"),
      );
    } catch {
      continue;
    }
    // Private packages are never published, so their `files` says nothing about
    // tarballs (`core` and `icons-base` legitimately ship `src`).
    if (manifest.private) continue;
    checked += 1;

    for (const entry of manifest.files ?? []) {
      assert.ok(
        entry === "dist" || (entry.endsWith(".md") && !neverShipped.has(entry)),
        `${name} ships ${entry}`,
      );
    }
  }

  assert.ok(checked > 5, `only ${checked} published packages found`);
});
