import type { ComponentDoc } from "react-docgen-typescript";
import { remoteComponentBaseNameOf } from "../lib/remoteComponentBaseNameOf";
import { remoteComponentNameOf } from "../lib/remoteComponentNameOf";
import { remoteElementTagNameOf } from "../lib/remoteElementTagNameOf";
import { isSlot } from "../lib/propClassifiers";

/**
 * The Vue counterpart of `generateRemoteReactComponentFile`, and deliberately
 * much smaller: the event map React needs in every file is already on the
 * element class at runtime (`remoteEventDefinitions`), and the Vue factory
 * reads it there. Only the slot names have to be written out, because they are
 * needed as a _type_ — a Vue component declares its slots, and the element
 * class carries them at runtime only.
 */
export function generateRemoteVueComponentFile(c: ComponentDoc) {
  const t = {
    element: remoteComponentNameOf(c),
    name: remoteComponentBaseNameOf(c),
    tag: remoteElementTagNameOf(c),
    slots: Object.keys(c.props)
      .sort()
      .filter((prop) => isSlot(c, prop))
      .map((prop) => `"${prop}"`)
      .join(", "),
  };

  const options = t.slots ? `, { slots: [${t.slots}] }` : "";
  const slotNames = t.slots ? `, ${t.slots.replaceAll('", "', '" | "')}` : "";

  /*
   * The component type is annotated rather than inferred. Inference expands the
   * whole props type, and four chart components reference a type that is not
   * reachable from this package's own module graph — TS2883, "cannot be named
   * without a reference to …". The annotation names it through the alias that
   * is imported anyway.
   */
  return `\
    import { createFlowRemoteComponent } from "@/lib/createFlowRemoteComponent";
    import type { FlowRemoteVueComponent } from "@/lib/types";
    import { ${t.element} } from "@mittwald/flow-remote-elements";
    import type { ${t.element}Props } from "@mittwald/flow-remote-elements";
    export { type ${t.element}Props as ${t.name}Props } from "@mittwald/flow-remote-elements";

    export const ${t.name}: FlowRemoteVueComponent<${t.element}Props${slotNames}> = createFlowRemoteComponent(
      "${t.tag}",
      "${t.name}",
      ${t.element}${options},
    );
  `;
}

export function generateRemoteVueComponentIndexFile(
  componentSpecifications: ComponentDoc[],
) {
  let indexFile = "";

  componentSpecifications.map((component) => {
    indexFile += `export * from "./${remoteComponentBaseNameOf(component)}";`;
  });

  return indexFile;
}
