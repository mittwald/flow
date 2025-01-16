import type { ComponentDoc } from "react-docgen-typescript";

export const componentModulePathOf = (c: ComponentDoc) => {
  const [, componentsPath] =
    /.*src\/components\/(.*?)\/.*/.exec(c.filePath) ?? [];

  const [, integrationsPath, integrationComponent] =
    /.*src\/integrations\/(.*?)\/components\/(.*?)\/.*/.exec(c.filePath) ?? [];

  const path = componentsPath ?? `${integrationsPath}/${integrationComponent}`;

  if (!path) {
    throw new Error(`Could not get component module path from ${c.filePath}`);
  }

  return path;
};
