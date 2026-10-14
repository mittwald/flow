import { relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";
import { proIconsPackage, readProIconsVersion } from "./dev/proIcons.js";

/*
 * The Styleguide renders FontAwesome Pro icons once `dev/installProIcons.ts`
 * fetched them (`build` and `dev` run it first). Without them — a fork's PR,
 * Dependabot — both names the Pro icons go by are swapped for stand-ins in
 * `src/app/_lib/withoutProIcons`, and the default icons stay.
 */
const proIconsAlias = readProIconsVersion()
  ? {
      "@fortawesome/sharp-regular-svg-icons": `./${relative(
        fileURLToPath(new URL(".", import.meta.url)),
        fileURLToPath(proIconsPackage),
      )}`,
    }
  : {
      "@mittwald/flow-icons-pro": "./src/app/_lib/withoutProIcons/iconsPro.ts",
      "@fortawesome/sharp-regular-svg-icons":
        "./src/app/_lib/withoutProIcons/sharpRegular.ts",
    };

/** @type {import("next").NextConfig} */
const nextConfig = {
  /*
   * `next dev` otherwise appends its managed agent-rules block to this app's
   * AGENTS.md on every start. It writes the paragraphs unwrapped, prettier
   * rewraps them at 80 columns, and the two overwrite each other forever — so
   * every dev run leaves a dirty tree, and committing the block instead breaks
   * `format:check` on push. Our AGENTS.md files are hand-written; the Next 16
   * pointer the block carried is now a line in this app's AGENTS.md.
   */
  agentRules: false,
  output: "export",
  basePath: process.env.NEXT_BASE_PATH ?? "",
  transpilePackages: ["next-mdx-remote"],
  experimental: {
    useTypeScriptCli: true,
  },
  turbopack: {
    resolveAlias: proIconsAlias,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_BASE_PATH ?? "",
  },
};

const pageExtensions = ["js", "jsx", "mdx", "ts", "tsx"];

const withMDX = createMDX();

/*
 * `page.dev.tsx` is a page under `next dev` only, so the static export ships
 * none of the development tooling — the release-figure example stages.
 */
export default (/** @type {string} */ phase) =>
  withMDX({
    ...nextConfig,
    pageExtensions:
      phase === PHASE_DEVELOPMENT_SERVER
        ? ["dev.tsx", ...pageExtensions]
        : pageExtensions,
  });
