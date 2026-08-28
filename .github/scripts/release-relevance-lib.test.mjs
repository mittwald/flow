// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isPublishRelevant,
  classifyChangedFiles,
  classifyRootManifestChange,
} from "./release-relevance-lib.mjs";

test("isPublishRelevant: docs, CI and tooling paths are irrelevant", () => {
  for (const path of [
    ".github/workflows/publish.yml",
    ".github/scripts/release-relevance-lib.mjs",
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    "apps/docs/src/content/04-components/button.mdx",
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
      "apps/docs/src/content/01-foundations/typography.mdx",
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
    "apps/docs/src/content/04-components/button.mdx",
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
      "apps/docs/src/app/04-components/[group]/[component]/develop/page.tsx",
      "apps/docs/src/app/01-get-started/[...slug]/page.tsx",
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
    { rootManifestRelevant: false },
  );
  assert.equal(result.publish, false);
  assert.deepEqual(result.relevant, []);
});

test("classifyChangedFiles: an unclassified root manifest still publishes", () => {
  for (const options of [undefined, {}, { rootManifestRelevant: true }]) {
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
      rootManifestRelevant: false,
    }).publish,
    false,
  );
  assert.equal(
    classifyChangedFiles(["package.json", "pnpm-lock.yaml"], {
      rootManifestRelevant: true,
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
