import jetpack from "fs-jetpack";
import { createRequire } from "module";
import { buildComponentTokens } from "../src/lib/componentTokens/buildComponentTokens.js";

// The `json` build carries `filePath`, which tells component tokens from base
// tokens, and `original`, the unresolved reference — `json-runtime` drops both.
const require = createRequire(import.meta.url);
const readTokens = (theme: "light" | "dark"): unknown =>
  jetpack.read(
    require.resolve(`@mittwald/flow-design-tokens/json/all-${theme}.json`),
    "json",
  );

const outputPath = "./src/lib/componentTokens/componentTokens.generated.json";

jetpack.write(
  outputPath,
  JSON.stringify(buildComponentTokens(readTokens("light"), readTokens("dark"))),
);
console.log(`Wrote ${outputPath}`);
