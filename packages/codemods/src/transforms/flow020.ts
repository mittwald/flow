import type { Transform } from "jscodeshift";

const flowImportPaths: Transform = (fileInfo, { j }) => {
  const flowPackage = "@mittwald/flow-react-components";

  const root = j(fileInfo.source, {
    parser: "ts",
  });

  const subPackages = ["react-hook-form", "nextjs"];

  root
    .find(j.ImportDeclaration)
    .filter((i) => String(i.node.source.value).startsWith(`${flowPackage}/`))
    .forEach((i) => {
      const specifiers = i.node.specifiers ?? [];

      const packageSubPath =
        String(i.node.source.value)
          .slice(flowPackage.length + 1)
          .split("/")[0] ?? "";

      if (i.node.source.value === `${flowPackage}/all.css`) {
        return;
      }

      i.node.source.value = flowPackage;

      if (subPackages.includes(packageSubPath)) {
        i.node.source.value += `/${packageSubPath}`;
      }

      specifiers.forEach((s, i) => {
        if (
          s.type === "ImportDefaultSpecifier" ||
          s.type === "ImportSpecifier"
        ) {
          const name =
            s.type === "ImportDefaultSpecifier"
              ? (s.local?.name ?? "")
              : (s.imported?.name ?? "");

          specifiers[i] = {
            ...s,
            type: "ImportSpecifier",
            imported: {
              type: "Identifier",
              name,
            },
          };
        }
      });
    });

  return root.toSource();
};

export default flowImportPaths;
