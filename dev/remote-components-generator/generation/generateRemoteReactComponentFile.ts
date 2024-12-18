import type { ComponentDoc } from "react-docgen-typescript";
import { kebabize } from "../lib/kebabize";
import { remoteComponentGeneratorConfig } from "../config";

export function generateRemoteReactComponentFile(
  componentSpecification: ComponentDoc,
) {
  const config = remoteComponentGeneratorConfig;
  const componentProps = componentSpecification.props;

  config.ignoreProps.map((prop) => delete componentProps[prop]);

  const t = {
    component: `Remote${componentSpecification.displayName}Element`,
    name: componentSpecification.displayName,
    events: Object.keys(componentProps)
      .filter((propName) => propName.startsWith("on"))
      .map((propName) => {
        const formattedName = propName[2].toLowerCase() + propName.slice(3);
        return `${propName}: { event: "${formattedName}" } as never`;
      })
      .join(",\n"),
  };

  return `\
    import { createRemoteComponent } from "@remote-dom/react";
    import { ${t.component} } from "@mittwald/flow-remote-elements";

    export const ${t.name} = createRemoteComponent("flr-${kebabize(t.name)}", ${t.component}, {${
      t.events && t.events.length > 0
        ? `eventProps: {
          ${t.events}
        },`
        : ""
    }});
  `;
}

export function generateRemoteReactComponentIndexFile(
  componentSpecifications: ComponentDoc[],
) {
  let indexFile = "";

  componentSpecifications.map((component) => {
    indexFile += `export * from "./${component.displayName}";`;
  });

  return indexFile;
}
