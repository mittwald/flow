// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isPublishRelevant,
  classifyChangedFiles,
  classifyPackageManifestChange,
  classifyRootManifestChange,
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

test("isPublishRelevant: package-local paths without consumer effect", () => {
  for (const path of [
    "packages/components/.storybook/main.ts",
    "packages/components/.storybook/preview.tsx",
    "packages/components/Dockerfile",
    "packages/components/.dockerignore",
    "packages/remote-react-components/e2e/cross-version/vitest.config.ts",
    "packages/remote-react-components/src/tests/visual/Accordion.browser.test.tsx",
    "packages/components/src/components/List/stories/Default.stories.tsx",
    "packages/components/src/components/Button/Button.browser.test.tsx",
    "packages/codemods/src/tests/install.test.ts",
  ]) {
    assert.equal(isPublishRelevant(path), false, path);
  }
});

test("isPublishRelevant: a package's own dev/ IS a build input", () => {
  // #3023 proposed skipping `packages/*/dev/**`. It cannot be skipped: these
  // shape `dist` — vite plugins in the build config, generators writing shipped
  // assets, and the one that writes the published MIGRATION.md.
  for (const path of [
    "packages/components/dev/vite/flowComponentsLayerPlugin.ts",
    "packages/components/dev/component-index/buildComponentIndex.ts",
    "packages/codemods/dev/generate/migrationGuide.ts",
  ]) {
    assert.equal(isPublishRelevant(path), true, path);
  }
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

test("classifyChangedFiles: Storybook- and image-only pushes do not publish", () => {
  // #3010 "build(components): use the next-themes client entry in Storybook"
  // → 1.0.14
  assert.equal(
    classifyChangedFiles(["packages/components/.storybook/preview.tsx"])
      .publish,
    false,
  );
  // #3008 "ci: build the preview apps in CI and let the image only package
  // them" → its packages/ half was the Storybook image alone
  assert.equal(
    classifyChangedFiles([
      ".github/workflows/build-previews.yml",
      "apps/docs/Dockerfile",
      "packages/components/Dockerfile",
      "packages/components/.dockerignore",
    ]).publish,
    false,
  );
});

test("classifyChangedFiles: a docs-only dependency patch still publishes", () => {
  // #3020 patched `@mfalkenberg/react-live-ssr`, an apps/docs dependency, and
  // cut 1.1.5. Ruling that out needs the lockfile's importer graph, so the
  // path-level fail-safe stands — asserted so the gap stays deliberate.
  assert.equal(
    classifyChangedFiles([
      "apps/docs/src/components/LiveExample.tsx",
      "patches/@mfalkenberg__react-live-ssr@4.1.7.patch",
      "pnpm-workspace.yaml",
      "pnpm-lock.yaml",
    ]).publish,
    true,
  );
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
    /all 2 changed file\(s\) are docs\/CI\/tooling only/,
  );
  assert.match(
    classifyChangedFiles(["apps/docs/a.mdx", "packages/components/src/a.ts"])
      .reason,
    /1 of 2 changed file\(s\) affect published packages/,
  );
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

test("classifyRootManifestChange: a scripts-only change is irrelevant", () => {
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
  assert.equal(classifyRootManifestChange(before, after).relevant, false);
});

test("classifyRootManifestChange: dependency and wiring keys stay relevant", () => {
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
      classifyRootManifestChange(JSON.stringify(base), after).relevant,
      true,
      key,
    );
  }
});

test("classifyRootManifestChange: unparsable or unknown content is relevant", () => {
  assert.equal(classifyRootManifestChange("{ not json", "{}").relevant, true);
  assert.equal(classifyRootManifestChange(null, "{}").relevant, true);
  assert.equal(classifyRootManifestChange("{}", undefined).relevant, true);
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
    { manifestRelevance: { "package.json": true } },
  ]) {
    assert.equal(
      classifyChangedFiles(["apps/docs/a.mdx", "package.json"], options)
        .publish,
      true,
    );
  }
});

test("classifyPackageManifestChange: a scripts-only change is irrelevant", () => {
  // #3006 edited remote-react-components' `--project=unit` glob and cut 1.0.12.
  const before = JSON.stringify({
    name: "@mittwald/flow-remote-react-components",
    scripts: { "test:unit": "vitest run --project=unit" },
  });
  const after = JSON.stringify({
    name: "@mittwald/flow-remote-react-components",
    scripts: { "test:unit": "vitest run --project=unit*" },
  });
  const result = classifyPackageManifestChange(
    before,
    after,
    "packages/remote-react-components/package.json",
  );
  assert.equal(result.relevant, false);
  assert.match(result.reason, /packages\/remote-react-components/);
});

test("classifyPackageManifestChange: install scripts DO reach a consumer", () => {
  // The tarball carries `scripts`; only the install lifecycle runs on a
  // consumer's machine. No Flow package has one today — the guard is for the
  // day one appears.
  for (const name of ["preinstall", "install", "postinstall", "prepare"]) {
    const result = classifyPackageManifestChange(
      JSON.stringify({ scripts: { build: "vite build" } }),
      JSON.stringify({ scripts: { build: "vite build", [name]: "node x.js" } }),
      "packages/components/package.json",
    );
    assert.equal(result.relevant, true, name);
    assert.match(result.reason, /scripts/);
  }
});

test("classifyPackageManifestChange: everything else stays relevant", () => {
  const base = { name: "@mittwald/flow-react-components", version: "1.1.0" };
  for (const change of [
    { dependencies: { react: "^19" } },
    { peerDependencies: { react: "^19" } },
    { devDependencies: { vite: "^8" } },
    { exports: { ".": "./dist/js/default.mjs" } },
    { files: ["dist"] },
    { version: "1.1.1" },
    { sideEffects: false },
    { somethingBrandNew: true },
  ]) {
    const result = classifyPackageManifestChange(
      JSON.stringify(base),
      JSON.stringify({ ...base, ...change }),
      "packages/components/package.json",
    );
    assert.equal(result.relevant, true, Object.keys(change)[0]);
  }
  // Unreadable content fails safe, like the root manifest.
  assert.equal(
    classifyPackageManifestChange("not json", "{}", "packages/x/package.json")
      .relevant,
    true,
  );
});

test("classifyChangedFiles: a scripts-only package manifest does not publish", () => {
  // #3006 → 1.0.12: a CI change whose packages/ half was a scripts edit, a
  // non-shipped Markdown file, dev/ tooling and the visual suite.
  const result = classifyChangedFiles(
    [
      ".github/workflows/test.yml",
      "packages/remote-react-components/package.json",
      "packages/remote-react-components/e2e/cross-version/harness.ts",
      "packages/remote-react-components/src/tests/visual/Accordion.browser.test.tsx",
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

test("classifyChangedFiles: a mixed push with a skipped manifest publishes", () => {
  const result = classifyChangedFiles(
    [
      "packages/components/package.json",
      "packages/components/src/components/Button/Button.tsx",
    ],
    { manifestRelevance: { "packages/components/package.json": false } },
  );
  assert.equal(result.publish, true);
  assert.deepEqual(result.relevant, [
    "packages/components/src/components/Button/Button.tsx",
  ]);
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
