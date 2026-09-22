import type { ComponentDoc } from "react-docgen-typescript";
import { remoteComponentBaseNameOf } from "../lib/remoteComponentBaseNameOf";
import { remoteComponentNameOf } from "../lib/remoteComponentNameOf";
import { remoteElementTagNameOf } from "../lib/remoteElementTagNameOf";
import { checkTagIsSet } from "../lib/docTags";

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
    /*
     * `flowComponent` defaults to the `"ui"` provision type, which wraps the
     * remote element in a `ClearPropsContext`. That is wrong for a provider:
     * where the local counterpart is not `@flr-generate` — `ModalTrigger`
     * renders `OverlayTrigger` around `DialogTriggerView` — the provider runs
     * inside the remote tree, and clearing there drops the props context it
     * just set. `@flr-provider` carries the type over.
     */
    provisionType: checkTagIsSet(c.tags, "provider") ? `type: "provider",` : "",
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
