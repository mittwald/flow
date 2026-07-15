import type { Transform } from "jscodeshift";

const flow100Transform: Transform = (fileInfo, { j }) => {
  const flowPackage = "@mittwald/flow-react-components";
  const passwordToolsPackage = `${flowPackage}/mittwald-password-tools-js`;

  const root = j(fileInfo.source, {
    parser: "ts",
  });

  root
    .find(j.ImportDeclaration)
    .filter((i) => String(i.node.source.value) === flowPackage)
    .forEach((i) => {
      const specifiers = i.node.specifiers ?? [];
      const passwordCreationFieldImport = specifiers.find((specifier) => {
        return (
          specifier.type === "ImportSpecifier" &&
          specifier.imported.type === "Identifier" &&
          specifier.imported.name === "PasswordCreationField"
        );
      });

      if (!passwordCreationFieldImport) {
        return;
      }

      i.node.specifiers = specifiers.filter((specifier) => {
        return (
          specifier.type !== "ImportSpecifier" ||
          specifier.imported.type !== "Identifier" ||
          specifier.imported.name !== "PasswordCreationField"
        );
      });

      if (i.node.specifiers?.length === 0) {
        j(i).remove();
      }

      const passwordToolsImports = root
        .find(j.ImportDeclaration)
        .filter((declaration) => {
          return String(declaration.node.source.value) === passwordToolsPackage;
        });

      if (passwordToolsImports.length > 0) {
        const existingImport = passwordToolsImports.at(0).get().node;
        existingImport.specifiers = existingImport.specifiers ?? [];
        const existingSpecifiers = existingImport.specifiers;
        const hasPasswordCreationFieldSpecifier = existingSpecifiers.some(
          (specifier) => {
            return (
              specifier.type === "ImportSpecifier" &&
              specifier.imported.type === "Identifier" &&
              specifier.imported.name === "PasswordCreationField"
            );
          },
        );

        if (!hasPasswordCreationFieldSpecifier) {
          existingSpecifiers.push({
            ...passwordCreationFieldImport,
          });
        }
        return;
      }

      const importSpecifier = {
        ...passwordCreationFieldImport,
      };

      const importDeclaration = j.importDeclaration(
        [importSpecifier],
        j.stringLiteral(passwordToolsPackage),
      );

      const firstFlowImport = root
        .find(j.ImportDeclaration)
        .filter((declaration) => {
          return String(declaration.node.source.value).startsWith(flowPackage);
        })
        .at(0);

      if (firstFlowImport.length > 0) {
        firstFlowImport.insertBefore(importDeclaration);
      } else {
        root.get().node.program.body.unshift(importDeclaration);
      }
    });

  return root.toSource();
};

export default flow100Transform;
