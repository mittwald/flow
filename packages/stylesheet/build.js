import * as url from "url";
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";

const stylesheetPathname = createRequire(import.meta.url).resolve(
  "@mittwald/flow-react-components/styles",
);

const thisDirname = path.dirname(url.fileURLToPath(import.meta.url));

const targetPathname = path.join(thisDirname, "dist/styles.css");

if (!fs.existsSync(path.dirname(targetPathname))) {
  fs.mkdirSync(path.dirname(targetPathname));
}

fs.copyFileSync(stylesheetPathname, targetPathname);
