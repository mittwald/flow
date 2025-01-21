import type { Transform } from "jscodeshift";

const flowToFlowRemoteTransform: Transform = (fileInfo, { j }) => {
  const flowPackage = "@mittwald/flow-react-components";

  const root = j(fileInfo.source, {
    parser: "ts",
  });

  const subPackages = ["hooks", "controller", "Icons", "react-hook-form"];

  root
    .find(j.ImportDeclaration)
    .filter((i) => String(i.node.source.value).startsWith(`${flowPackage}/`))
    .forEach((i) => {
      const specifiers = i.node.specifiers ?? [];

      const packageSubPath = String(i.node.source.value).slice(
        flowPackage.length + 1,
      );

      i.node.source.value = "@mittwald/flow-remote-react-components";

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
              ? packageSubPath
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

export default flowToFlowRemoteTransform;
