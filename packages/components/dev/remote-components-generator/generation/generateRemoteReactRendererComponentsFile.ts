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
          import { ${c.displayName} as ${remoteComponentBaseNameOf(c)} } from "@mittwald/flow-react-components/${componentModulePathOf(c)}";
        `,
      )
      .join(""),
    mapEntries: components
      .map(
        (c) => `\
          "${remoteElementTagNameOf(c)}": createFlowRemoteComponentRenderer(
            lazy(() => import("@mittwald/flow-react-components/${componentModulePathOf(c)}").then((module) => ({ default: module.${c.displayName} })))
          ),`,
      )
      .join("\n"),
  };

  return `
    import { createFlowRemoteComponentRenderer } from "~/lib/createFlowRemoteComponentRenderer";
    import { lazy } from "react";
    
    export const flowComponents = {
      ${t.mapEntries}
    } as const;

    export default flowComponents;
  `;
}
