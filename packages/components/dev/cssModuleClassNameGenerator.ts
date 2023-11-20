export const cssModuleClassNameGenerator = (
  name: string,
  filename: string,
): string => {
  if (name === "flow") {
    return name;
  }

  if (!filename.endsWith(".module.css")) {
    return name;
  }

  const parts = Array.from(filename.matchAll(/(components\/(.+?)\/)/g)).map(
    (p) => p[2],
  );

  if (parts.length > 0) {
    if (name !== "root") {
      parts.push(name);
    }

    return "flow-" + parts.map((p) => p.toLowerCase()).join("-");
  }

  return name;
};
