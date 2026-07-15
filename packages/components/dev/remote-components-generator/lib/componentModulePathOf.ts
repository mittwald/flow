import type { ComponentDoc } from "react-docgen-typescript";

const componentExportPathMap: Record<string, string> = {
  PasswordCreationField: "/password-tools",
};

export const componentModulePathOf = (c: ComponentDoc) => {
  const mappedPath = componentExportPathMap[c.displayName];
  if (mappedPath) {
    return mappedPath;
  }

  const [, integrationsPath, integrationComponent] =
    /.*src\/integrations\/(.*?)\/components\/(.*?)\/.*/.exec(c.filePath) ?? [];

  return integrationsPath ? `/${integrationsPath}/${integrationComponent}` : "";
};
