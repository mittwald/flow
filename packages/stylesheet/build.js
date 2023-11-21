import * as url from "url";
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";

const stylesheetPathname = createRequire(import.meta.url).resolve(
  "@mittwald/flow-components/style",
);

const targetPathname = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  "dist/style.css",
);

if (!fs.existsSync(path.dirname(targetPathname))) {
  fs.mkdirSync(path.dirname(targetPathname));
}

fs.copyFileSync(stylesheetPathname, targetPathname);
