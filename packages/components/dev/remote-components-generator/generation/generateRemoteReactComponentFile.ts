import type { ComponentDoc } from "react-docgen-typescript";
import { remoteComponentBaseNameOf } from "../lib/remoteComponentBaseNameOf";
import { remoteComponentNameOf } from "../lib/remoteComponentNameOf";
import { remoteElementTagNameOf } from "../lib/remoteElementTagNameOf";
import { provisionTypeOf } from "../lib/provisionTypeOf";
import { readFileSync } from "fs";

export function generateRemoteReactComponentFile(c: ComponentDoc) {
  const componentProps = c.props;

  const name = remoteComponentBaseNameOf(c);
  /*
   * `flowComponent` defaults to `"ui"`, which wraps the remote element in a
   * `ClearPropsContext`. A remote composition (`Modal`, `List`, …) sets its
   * props contexts in the remote tree, so a `"layout"` or `"provider"`
   * component created as `"ui"` there cuts them off for its children. The
   * remote component takes the type of the local `flowComponent` call.
   */
  const provisionType = provisionTypeOf(
    readFileSync(c.filePath, "utf-8"),
    name,
  );

  const t = {
    remoteComponentName: remoteComponentNameOf(c),
    name,
    events: Object.keys(componentProps)
      .sort()
      .filter((propName) => propName.startsWith("on"))
      .map((propName) => {
        const formattedName = propName[2]?.toLowerCase() + propName.slice(3);
        return `${propName}: { event: "${formattedName}" } as never`;
      })
      .join(",\n"),
    provisionType: provisionType ? `type: "${provisionType}",` : "",
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
      ${t.provisionType}
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
