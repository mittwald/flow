import * as url from "url";
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";

const stylesheetPathname = createRequire(import.meta.url).resolve(
  "@mittwald/flow-react-components/all.css",
);
const layeredStylesheetPathname = createRequire(import.meta.url).resolve(
  "@mittwald/flow-react-components/all-layered.css",
);

const thisDirname = path.dirname(url.fileURLToPath(import.meta.url));

const targetPathname = path.join(thisDirname, "dist/styles.css");
const layeredTargetPathname = path.join(
  thisDirname,
  "dist/styles-layered.css",
);

if (!fs.existsSync(path.dirname(targetPathname))) {
  fs.mkdirSync(path.dirname(targetPathname));
}

fs.copyFileSync(stylesheetPathname, targetPathname);
fs.copyFileSync(layeredStylesheetPathname, layeredTargetPathname);

const previousUnlayeredTargetPathname = path.join(
  thisDirname,
  "dist/styles.unlayered.css",
);
if (fs.existsSync(previousUnlayeredTargetPathname)) {
  fs.unlinkSync(previousUnlayeredTargetPathname);
}
