import type { ComponentDoc } from "react-docgen-typescript";
import { remoteComponentBaseNameOf } from "../lib/remoteComponentBaseNameOf";
import { remoteComponentNameOf } from "../lib/remoteComponentNameOf";
import { remoteElementTagNameOf } from "../lib/remoteElementTagNameOf";
import { isEvent, isSlot } from "../lib/propClassifiers";

/**
 * The Vue counterpart of `generateRemoteReactComponentFile`, and deliberately
 * much smaller: the event map React needs in every file is already on the
 * element class at runtime (`remoteEventDefinitions`), and the Vue factory
 * reads it there. Two things have to be written out. The slot names, because
 * they are needed as a _type_ — a Vue component declares its slots, and the
 * element class carries them at runtime only. And the boolean props, because
 * the element carries no types at all, and a bare attribute (`<TextField
 * is-required>`) arrives as `""`.
 */
export function generateRemoteVueComponentFile(c: ComponentDoc) {
  const quoted = (props: string[]) =>
    props
      .sort()
      .map((prop) => `"${prop}"`)
      .join(", ");

  const t = {
    element: remoteComponentNameOf(c),
    name: remoteComponentBaseNameOf(c),
    tag: remoteElementTagNameOf(c),
    slots: quoted(Object.keys(c.props).filter((prop) => isSlot(c, prop))),
    booleans: quoted(
      Object.keys(c.props).filter(
        (prop) =>
          !isEvent(prop) &&
          !isSlot(c, prop) &&
          c.props[prop]?.type.name === "boolean",
      ),
    ),
  };

  const optionEntries = [
    t.slots ? `slots: [${t.slots}]` : undefined,
    t.booleans ? `booleans: [${t.booleans}]` : undefined,
  ].filter(Boolean);
  const options =
    optionEntries.length > 0 ? `, { ${optionEntries.join(", ")} }` : "";
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
