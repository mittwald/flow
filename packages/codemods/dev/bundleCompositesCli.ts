import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { bundleComposite, listComposites } from "./bundleComposites";

const transformsDir = fileURLToPath(
  new URL("../src/transforms", import.meta.url),
);

for (const file of await listComposites()) {
  await writeFile(join(transformsDir, file), await bundleComposite(file));
  console.log(`bundled src/composites/${file} -> src/transforms/${file}`);
}
