import { dirname } from "path";
import * as _dirname from "./dirname.cjs";

const parentDir = dirname(_dirname.default);

export const cssModuleClassNameGenerator = (
  name: string,
  filename: string,
): string => {
  if (name === "flow") {
    return name;
  }

  const relativeFilename = filename.startsWith(parentDir)
    ? filename.slice(parentDir.length)
    : filename;

  if (!/.*\.module\.s?css/.test(relativeFilename)) {
    return name;
  }

  const parts = Array.from(
    relativeFilename.matchAll(/(components\/(.+?)\/)/g),
  ).map((p) => p[2]);

  if (parts.length > 0) {
    if (name !== "root") {
      parts.push(name);
    }

    return "flow-" + parts.map((p) => p.toLowerCase()).join("-");
  }

  return name;
};
