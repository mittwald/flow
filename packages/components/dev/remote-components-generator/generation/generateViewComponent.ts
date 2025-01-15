import type { ComponentDoc } from "react-docgen-typescript";
import { remoteComponentBaseNameOf } from "../lib/remoteComponentBaseNameOf";

export function generateViewComponent(c: ComponentDoc) {
  const t = {
    viewComponentName: remoteComponentBaseNameOf(c),
    componentName: c.displayName,
  };

  return `\
    import type { ${t.componentName} } from "./${t.componentName}";
    import type { ViewComponent } from "~/lib/viewComponentContext";

    declare global {
      interface FlowViewComponents {
        ${t.viewComponentName}: ViewComponent<typeof ${t.componentName}>;
      }
    }
  `;
}
