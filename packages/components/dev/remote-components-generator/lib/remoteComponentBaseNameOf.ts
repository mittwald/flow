import type { ComponentDoc } from "react-docgen-typescript";
import camelcase from "camelcase";

export const remoteComponentBaseNameOf = (c: ComponentDoc) => {
  const [, integrationPath] =
    /src\/integrations\/(.*?)\/.*/.exec(c.filePath) ?? [];

  const [, componentName] =
    /.*\/components\/(.*?)(\.|\/)/.exec(c.filePath) ?? [];

  const [, viewName] = /src\/.*?\/views\/?.*\/(.*)\..*/.exec(c.filePath) ?? [];

  if (!componentName) {
    throw new Error(`Could not get component name from ${c.filePath}`);
  }

  return (
    camelcase(integrationPath ?? "", {
      pascalCase: true,
    }) +
    componentName +
    (viewName ? viewName : "")
  );
};
