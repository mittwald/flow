import type { Transform } from "jscodeshift";

const flowImportPaths: Transform = (fileInfo, { j }) => {
  const flowPackage = "@mittwald/flow-react-components";

  const root = j(fileInfo.source, {
    parser: "ts",
  });

  root
    .find(j.ImportDeclaration)
    .filter((i) => String(i.node.source.value).startsWith(`${flowPackage}/`))
    .forEach((i) => {
      const specifiers = i.node.specifiers ?? [];
      const importPath = String(i.node.source.value);
      const importRelativePath = importPath.slice(flowPackage.length + 1);

      console.log(importRelativePath);
      if (importRelativePath === "doc-properties") {
        return;
      }

      if (
        importRelativePath === "all.css" ||
        importRelativePath === "globals.css" ||
        importRelativePath === "global.css"
      ) {
        i.node.source.value = `${flowPackage}/all.css`;
        return;
      }

      if (importRelativePath.startsWith("react-hook-form")) {
        i.node.source.value = `${flowPackage}/react-hook-form`;
      } else if (importRelativePath.startsWith("nextjs")) {
        i.node.source.value = `${flowPackage}/nextjs`;
      } else {
        i.node.source.value = flowPackage;
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
