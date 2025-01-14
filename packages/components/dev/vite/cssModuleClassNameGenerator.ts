import decamelize from "decamelize";

const parentDir = __dirname;

export const cssModuleClassNameGenerator = (
  name: string,
  filename: string,
): string => {
  name = decamelize(name, { separator: "-" });
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
  ).map((p) => decamelize(p[2] ?? "", { separator: "-" }).toLowerCase());

  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1];

    if (lastPart !== name) {
      parts.push(name);
    }

    return "flow--" + parts.join("--");
  }

  return name;
};
