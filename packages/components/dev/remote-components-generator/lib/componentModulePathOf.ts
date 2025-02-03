import type { ComponentDoc } from "react-docgen-typescript";

export const componentModulePathOf = (c: ComponentDoc) => {
  const [, integrationsPath, integrationComponent] =
    /.*src\/integrations\/(.*?)\/components\/(.*?)\/.*/.exec(c.filePath) ?? [];

  return integrationsPath ? `/${integrationsPath}/${integrationComponent}` : "";
};
