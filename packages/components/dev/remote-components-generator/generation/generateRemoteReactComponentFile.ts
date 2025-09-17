import type { ComponentDoc } from "react-docgen-typescript";
import { remoteComponentBaseNameOf } from "../lib/remoteComponentBaseNameOf";
import { remoteComponentNameOf } from "../lib/remoteComponentNameOf";
import { remoteElementTagNameOf } from "../lib/remoteElementTagNameOf";

export function generateRemoteReactComponentFile(c: ComponentDoc) {
  const componentProps = c.props;

  const t = {
    remoteComponentName: remoteComponentNameOf(c),
    name: remoteComponentBaseNameOf(c),
    events: Object.keys(componentProps)
      .sort()
      .filter((propName) => propName.startsWith("on"))
      .map((propName) => {
        const formattedName = propName[2]?.toLowerCase() + propName.slice(3);
        return `${propName}: { event: "${formattedName}" } as never`;
      })
      .join(",\n"),
  };

  return `\
    "use client";
    import createFlowRemoteComponent from "@/components/createFlowRemoteComponent";
    import { ${t.remoteComponentName} } from "@mittwald/flow-remote-elements";
    export { type ${t.remoteComponentName} } from "@mittwald/flow-remote-elements";

    export const ${t.name} = createFlowRemoteComponent(
      "${remoteElementTagNameOf(c)}", 
      "${t.name}", 
      ${t.remoteComponentName}, {
      slotProps: {
        wrapper: "flr-slot-root-wrapper",
      },      
      eventProps: {
          ${t.events}
      },
    });
  `;
}

export function generateRemoteReactComponentIndexFile(
  componentSpecifications: ComponentDoc[],
) {
  let indexFile = "";

  componentSpecifications.map((component) => {
    indexFile += `export * from "./${remoteComponentBaseNameOf(component)}";`;
  });

  return indexFile;
}
