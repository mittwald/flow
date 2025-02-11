import type { ComponentDoc } from "react-docgen-typescript";

export const componentPathOf = (c: ComponentDoc) => {
  const [, componentsPath] =
    /.*src\/components\/(.*?)\/.*/.exec(c.filePath) ?? [];

  if (!componentsPath) {
    throw new Error(`Could not get component module path from ${c.filePath}`);
  }

  return componentsPath;
};
