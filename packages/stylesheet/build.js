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
const layeredTargetPathname = path.join(thisDirname, "dist/styles-layered.css");

if (!fs.existsSync(path.dirname(targetPathname))) {
  fs.mkdirSync(path.dirname(targetPathname));
}

const copyStylesheet = (source, target) =>
  fs.writeFileSync(
    target,
    fs.readFileSync(source, "utf8").replaceAll("url(../fonts/", "url(fonts/"),
  );

copyStylesheet(stylesheetPathname, targetPathname);
copyStylesheet(layeredStylesheetPathname, layeredTargetPathname);

fs.cpSync(
  path.join(path.dirname(stylesheetPathname), "../fonts"),
  path.join(thisDirname, "dist/fonts"),
  { recursive: true },
);

const previousUnlayeredTargetPathname = path.join(
  thisDirname,
  "dist/styles.unlayered.css",
);
if (fs.existsSync(previousUnlayeredTargetPathname)) {
  fs.unlinkSync(previousUnlayeredTargetPathname);
}
