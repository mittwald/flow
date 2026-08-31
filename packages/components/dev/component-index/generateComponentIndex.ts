import * as fsSync from "fs";
import * as fs from "fs/promises";
import path from "path";

import type { ComponentDoc } from "react-docgen-typescript";
import { buildComponentIndex, type StatusEntry } from "./buildComponentIndex";
import { parseFlrUniversalComponentNames } from "../status-registry/parseFlrUniversalComponentNames";

const DOC_PROPERTIES_FILE = "./dist/assets/doc-properties.json";
const STATUS_FILE = "./src/status/component-status.json";
const FLR_UNIVERSAL_FILE = "./src/index/flr-universal.ts";
const PACKAGE_JSON_FILE = "./package.json";
const ASSETS_DIR = "./dist/assets";
const TARGET_FILE = path.join(ASSETS_DIR, "component-index.json");

const DOCS_SITE = "https://flow.mittwald.de";

const docsMeta = (packageName: string, version: string) => ({
  package: packageName,
  version,
  docs: {
    site: DOCS_SITE,
    llmsTxt: `${DOCS_SITE}/llms.txt`,
    llmsJson: `${DOCS_SITE}/llms.json`,
    llmsFullTxt: `${DOCS_SITE}/llms-full.txt`,
    note:
      "The documentation is written in German; component names and design-system " +
      "terms are not translated. llms.json lists every page with a Markdown URL " +
      "under /raw/<path>.md — use it to resolve a component name to its page.",
  },
});

async function generateComponentIndex() {
  console.log("📚 Reading " + path.resolve(DOC_PROPERTIES_FILE));
  const components = JSON.parse(
    await fs.readFile(DOC_PROPERTIES_FILE, "utf-8"),
  ) as ComponentDoc[];

  console.log("📚 Reading " + path.resolve(STATUS_FILE));
  const statusRegistry = JSON.parse(
    await fs.readFile(STATUS_FILE, "utf-8"),
  ) as Record<string, StatusEntry>;

  const { name: packageName, version } = JSON.parse(
    await fs.readFile(PACKAGE_JSON_FILE, "utf-8"),
  ) as { name: string; version: string };

  const flrUniversalNames = parseFlrUniversalComponentNames(
    await fs.readFile(FLR_UNIVERSAL_FILE, "utf-8"),
  );

  console.log("🧮 Building component index");
  const componentIndex = buildComponentIndex(
    components,
    statusRegistry,
    packageName,
    flrUniversalNames,
  );

  const componentCount = Object.keys(componentIndex).length;
  if (componentCount === 0) {
    throw new Error(
      "The component index came out empty — check that " +
        `${STATUS_FILE} and ${DOC_PROPERTIES_FILE} are both current.`,
    );
  }

  if (!fsSync.existsSync(ASSETS_DIR)) {
    await fs.mkdir(ASSETS_DIR, { recursive: true });
  }

  console.log("📝 Writing " + path.resolve(TARGET_FILE));
  await fs.writeFile(
    TARGET_FILE,
    JSON.stringify({
      ...docsMeta(packageName, version),
      components: componentIndex,
    }) + "\n",
  );

  const propCount = Object.values(componentIndex).reduce(
    (total, component) => total + Object.keys(component.props).length,
    0,
  );
  const remoteCount = Object.values(componentIndex).filter(
    (component) => component.remote.available,
  ).length;
  const bytes = (await fs.stat(TARGET_FILE)).size;

  console.log(
    `✅  Done — ${componentCount} components (${remoteCount} remote-capable), ` +
      `${propCount} props, ${Math.round(bytes / 1024)} KB`,
  );
}

void generateComponentIndex().catch((error) => {
  console.error("❌ Failed to generate the component index:");
  console.error(error instanceof Error ? error.message : error);
  console.error(
    "   Run `pnpm nx build:status-registry components` first — it produces " +
      "both inputs (doc-properties.json and component-status.json).",
  );
  process.exitCode = 1;
});
