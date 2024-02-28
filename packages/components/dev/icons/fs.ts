import jetpack from "fs-jetpack";

export const fs = jetpack.cwd(import.meta.dirname);

export const writeIfHasChanges = (path: string, content: string): void => {
  const currentContent = fs.read(path);
  if (currentContent !== content) {
    fs.write(path, content);
  }
};
