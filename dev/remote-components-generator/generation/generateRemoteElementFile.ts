import type { ComponentDoc } from "react-docgen-typescript";
import { kebabize } from "../lib/kebabize";
import { remoteComponentGeneratorConfig } from "../config";

export function generateRemoteElementFile(
  componentSpecification: ComponentDoc,
) {
  const config = remoteComponentGeneratorConfig;
  const componentProps = componentSpecification.props;

  config.ignoreProps.map((prop) => delete componentProps[prop]);

  const t = {
    element: `Remote${componentSpecification.displayName}Element`,
    propsType: `${componentSpecification.displayName}Props`,
    name: componentSpecification.displayName,
    props: Object.keys(componentProps)
      .filter((propName) => !propName.startsWith("on"))
      .map((propName) => {
        const key = propName.includes("-") ? `'${propName}'` : propName;
        return `${key}: {}`;
      })
      .join(",\n"),
    events: Object.keys(componentProps)
      .filter((propName) => propName.startsWith("on"))
      .map((propName) => {
        const formattedName = propName[2].toLowerCase() + propName.slice(3);
        return `${formattedName}: {}`;
      })
      .join(",\n"),
  };

  return `\
    import { FlowRemoteElement } from "@/lib/FlowRemoteElement";
    import type { ${t.propsType} } from "@mittwald/flow-react-components/${t.name}";
    export type { ${t.propsType} } from "@mittwald/flow-react-components/${t.name}";
    
    
    export class ${t.element} extends FlowRemoteElement<${t.propsType}> {
      static get remoteProperties() {
        return {
          ${t.props}
        };
      }

      static get remoteEvents() {
        return {
          ${t.events}
        };
      }
    }    
    
    declare global {
      interface HTMLElementTagNameMap {
        "flr-${kebabize(t.name)}": InstanceType<typeof ${t.element}>;
      }
    }
    
    customElements.define("flr-${kebabize(t.name)}", ${t.element});
  `;
}
