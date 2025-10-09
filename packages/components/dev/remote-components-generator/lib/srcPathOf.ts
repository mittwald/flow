import type { ComponentDoc } from "react-docgen-typescript";

export const srcPathOf = (c: ComponentDoc) => {
  const [, srcPath] = /src\/(.+?)\.tsx/.exec(c.filePath) ?? [];

  if (!srcPath) {
    throw new Error(`Could not get src path from ${c.filePath}`);
  }

  return srcPath;
};
