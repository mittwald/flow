import type { ComponentDoc } from "react-docgen-typescript";
import { componentModulePathOf } from "../lib/componentModulePathOf";
import { isAttribute, isEvent, isProp, isSlot } from "../lib/propClassifiers";
import { remoteElementTagNameOf } from "../lib/remoteElementTagNameOf";
import { remoteComponentNameOf } from "../lib/remoteComponentNameOf";

export function generateRemoteElementFile(c: ComponentDoc) {
  const componentProps = c.props;

  const t = {
    exportPath: componentModulePathOf(c),
    element: remoteComponentNameOf(c),
    propsType: `${c.displayName}Props`,
    propsAliasType: `${remoteComponentNameOf(c)}Props`,
    name: c.displayName,
    props: Object.keys(componentProps)
      .sort()
      .filter((prop) => isProp(c, prop))
      .map((propName) => {
        const key = propName.includes("-") ? `'${propName}'` : propName;
        return `${key}: {}`;
      })
      .join(",\n"),
    slots: Object.keys(componentProps)
      .sort()
      .filter((prop) => isSlot(c, prop))
      .map((prop) => `"${prop}"`)
      .join(","),
    events: Object.keys(componentProps)
      .sort()
      .filter((prop) => isEvent(prop))
      .map((propName) => {
        const formattedName = propName[2]?.toLowerCase() + propName.slice(3);
        return `${formattedName}: {}`;
      })
      .join(",\n"),
    attributes: [
      "style",
      ...Object.keys(componentProps)
        .sort()
        .filter((prop) => isAttribute(c, prop)),
    ]
      .map((p) => `"${p}"`)
      .join(","),
  };

  return `\
    import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
    import type { ${t.propsType} as ${t.propsAliasType} } from "@mittwald/flow-react-components/${t.exportPath}";
    export type { ${t.propsType} as ${t.propsAliasType} } from "@mittwald/flow-react-components/${t.exportPath}";
    
    export class ${t.element} extends FlowRemoteElement<${t.propsAliasType}> {
      static override get remoteAttributes() {
        return [${t.attributes}];
      }

      static override get remoteProperties() {
        return {
          ${t.props}
        };
      }

      static override get remoteEvents() {
        return {
          ${t.events}
        };
      }

      static override get remoteSlots() {
        return [${t.slots}];
      }
    }    
    
    declare global {
      interface HTMLElementTagNameMap {
        "${remoteElementTagNameOf(c)}": InstanceType<typeof ${t.element}>;
      }
    }
    
    customElements.define("${remoteElementTagNameOf(c)}", ${t.element});
  `;
}

export function generateRemoteElementIndexFile(
  componentSpecifications: ComponentDoc[],
) {
  let indexFile = "";

  componentSpecifications.map((component) => {
    indexFile += `export * from "./${remoteComponentNameOf(component)}";`;
  });

  return indexFile;
}
