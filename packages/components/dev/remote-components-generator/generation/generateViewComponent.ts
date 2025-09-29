import type { ComponentDoc } from "react-docgen-typescript";
import { remoteComponentBaseNameOf } from "../lib/remoteComponentBaseNameOf";
import { srcPathOf } from "dev/remote-components-generator/lib/srcPathOf";

export function generateViewComponentDeclaration(c: ComponentDoc) {
  const t = {
    viewComponentName: remoteComponentBaseNameOf(c),
    componentName: c.displayName,
  };

  return `\
    import type { ${t.componentName} } from "./${t.componentName}";
    import type { ViewComponent } from "@/lib/viewComponentContext";

    declare global {
      interface FlowViewComponents {
        ${t.viewComponentName}: ViewComponent<typeof ${t.componentName}>;
      }
    }
  `;
}

export function generateViewComponent(c: ComponentDoc) {
  const t = {
    viewComponentName: remoteComponentBaseNameOf(c),
    componentName: c.displayName,
    srcPath: srcPathOf(c),
  };

  return `\
    import React, { memo, type FC, useContext } from "react";
    import { ${t.componentName}, type ${t.componentName}Props } from "@/${t.srcPath}";
    import { viewComponentContext } from "@/lib/viewComponentContext/viewComponentContext";
    
    const ${t.viewComponentName}View: FC<${t.componentName}Props> = memo((props) => {
      const View = useContext(viewComponentContext)["${t.viewComponentName}"] ?? ${t.componentName};
      return <View {...props} />;
    });
    ${t.viewComponentName}View.displayName = "${t.viewComponentName}View";
    
    export default ${t.viewComponentName}View;
  `;
}
