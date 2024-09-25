import jetpack from "fs-jetpack";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const fs = jetpack.cwd(__dirname);

export const writeIfHasChanges = (path: string, content: string): void => {
  const currentContent = fs.read(path);
  if (currentContent !== content) {
    fs.write(path, content);
  }
};
