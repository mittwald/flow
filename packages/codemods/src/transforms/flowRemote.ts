import type { Transform } from "jscodeshift";

const flowToFlowRemoteTransform: Transform = (fileInfo, { j }) => {
  const flowPackage = "@mittwald/flow-react-components";

  const root = j(fileInfo.source, {
    parser: "ts",
  });

  root
    .find(j.ImportDeclaration)
    .filter((i) => String(i.node.source.value).startsWith(flowPackage))
    .forEach((i) => {
      const importPath = String(i.node.source.value);

      i.node.source.value = importPath.replace(
        flowPackage,
        "@mittwald/flow-remote-react-components",
      );
    });

  return root.toSource();
};

export default flowToFlowRemoteTransform;
