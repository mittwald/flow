import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import jetpack from "fs-jetpack";
import { proIconsDir, readProIconsVersion } from "./proIcons.js";

/*
 * Fetches the FontAwesome Pro icons the Styleguide renders with. The workspace
 * aliases `@fortawesome/sharp-regular-svg-icons` to a free set, so
 * `pnpm install` needs no license. This installs the real package beside it,
 * outside the lockfile; `next.config.js` bundles it once it is there.
 *
 * - With `FONT_AWESOME_PACKAGE_TOKEN` (CI): FontAwesome's registry.
 * - Without it: npm.mittwald.it, which adds the token itself. It is reachable
 *   from mittwald's network only, so CI never tries it.
 *
 * Without either, the Styleguide keeps the default icons — unless
 * `FLOW_DOCS_REQUIRE_PRO_ICONS=1`, which the deployment sets.
 */
// The range `@mittwald/flow-icons-pro` accepts — the newest version the token
// grants within it, which is not necessarily the newest the free set has.
const iconsPro = JSON.parse(
  readFileSync(
    new URL(
      "../node_modules/@mittwald/flow-icons-pro/package.json",
      import.meta.url,
    ),
    "utf8",
  ),
) as { peerDependencies: Record<string, string> };
const range = iconsPro.peerDependencies["@fortawesome/sharp-regular-svg-icons"];
const required = process.env.FLOW_DOCS_REQUIRE_PRO_ICONS === "1";
const token = process.env.FONT_AWESOME_PACKAGE_TOKEN;

const skip = (reason: string): never => {
  if (required) {
    console.error(`FontAwesome Pro icons required, but ${reason}`);
    process.exit(1);
  }
  console.warn(`${reason} — the Styleguide shows the default icons`);
  process.exit(0);
};

if (readProIconsVersion()) {
  console.log(`FontAwesome Pro ${readProIconsVersion()} already installed`);
  process.exit(0);
}
if (!token && process.env.CI) {
  skip("FONT_AWESOME_PACKAGE_TOKEN is not set");
}

const registry = token
  ? [
      "@fortawesome:registry=https://npm.fontawesome.com/",
      // npm expands the variable itself, so the token never lands on disk.
      "//npm.fontawesome.com/:_authToken=${FONT_AWESOME_PACKAGE_TOKEN}",
    ]
  : // Authenticates with the developer's own npm.mittwald.it token.
    ["@fortawesome:registry=https://npm.mittwald.it/"];

const target = jetpack.dir(fileURLToPath(proIconsDir), { empty: true });
target.write("package.json", { private: true });
target.write(".npmrc", [...registry, ""].join("\n"));

try {
  execFileSync(
    "npm",
    [
      "install",
      "--no-audit",
      "--no-fund",
      "--fetch-retries=0",
      `@fortawesome/sharp-regular-svg-icons@${range}`,
    ],
    { cwd: target.cwd(), stdio: "inherit" },
  );
} catch {
  jetpack.remove(fileURLToPath(proIconsDir));
  skip("installing them failed");
}
console.log(`Installed FontAwesome Pro ${readProIconsVersion()}`);
