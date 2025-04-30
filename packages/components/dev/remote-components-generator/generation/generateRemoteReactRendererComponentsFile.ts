import type { ComponentDoc } from "react-docgen-typescript";
import { componentModulePathOf } from "../lib/componentModulePathOf";
import { remoteElementTagNameOf } from "../lib/remoteElementTagNameOf";
import { remoteComponentBaseNameOf } from "../lib/remoteComponentBaseNameOf";

export function generateRemoteReactRendererComponentsFile(
  components: ComponentDoc[],
) {
  const t = {
    imports: components
      .map(
        (c) => `\
          import { ${c.displayName} as ${remoteComponentBaseNameOf(c)} } from "@mittwald/flow-react-components${componentModulePathOf(c)}";
        `,
      )
      .join(""),
    mapEntries: components
      .map(
        (c) => `\
          "${remoteElementTagNameOf(c)}": createFlowRemoteComponentRenderer("${remoteComponentBaseNameOf(c)}", ${remoteComponentBaseNameOf(c)}),`,
      )
      .join("\n"),
  };

  return `
    import { createFlowRemoteComponentRenderer } from "@/lib/createFlowRemoteComponentRenderer";
    ${t.imports}
    
    export const flowComponents = {
      ${t.mapEntries}
    } as const;

    export default flowComponents;
  `;
}
