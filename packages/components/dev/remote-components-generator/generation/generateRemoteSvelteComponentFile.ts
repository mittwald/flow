import type { ComponentDoc } from "react-docgen-typescript";
import { isSlot } from "../lib/propClassifiers";
import { remoteComponentBaseNameOf } from "../lib/remoteComponentBaseNameOf";
import { remoteComponentNameOf } from "../lib/remoteComponentNameOf";
import { remoteElementTagNameOf } from "../lib/remoteElementTagNameOf";

const header = `\
<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
`;

/**
 * The Svelte counterpart of `generateRemoteReactComponentFile`, and much
 * smaller: the event map React needs in every file is already on the element
 * class at runtime (`remoteEventDefinitions`), and `RemoteElement.svelte` reads
 * it there. Only the slot names are written out — they are needed as a _type_,
 * and the element class carries them at runtime only.
 *
 * Unlike the other emitters this one writes its own formatting: the
 * repository's prettier run does not cover `.svelte`, so there is nothing to
 * format the output afterwards.
 */
export function generateRemoteSvelteComponentFile(c: ComponentDoc) {
  const t = {
    element: remoteComponentNameOf(c),
    name: remoteComponentBaseNameOf(c),
    tag: remoteElementTagNameOf(c),
    slots: Object.keys(c.props)
      .sort()
      .filter((prop) => isSlot(c, prop))
      .map((prop) => `"${prop}"`),
  };

  const slotNameType = t.slots.length > 0 ? `, ${t.slots.join(" | ")}` : "";
  const slotNamesProp =
    t.slots.length > 0 ? `\n  slotNames={[${t.slots.join(", ")}]}` : "";

  return `${header}<script lang="ts">
  import type { ${t.element}Props } from "@mittwald/flow-remote-elements";
  import { ${t.element} } from "@mittwald/flow-remote-elements";
  import RemoteElement from "../lib/RemoteElement.svelte";
  import type { FlowRemoteProps } from "../lib/types.js";

  let props: FlowRemoteProps<${t.element}Props${slotNameType}> = $props();
</script>

<RemoteElement
  tag="${t.tag}"
  name="${t.name}"
  element={${t.element}}${slotNamesProp}
  {...props}
/>
`;
}

/**
 * The package's own entry point for the generated surface.
 *
 * A `.svelte` file cannot export a type alongside its component, so the props
 * type is re-exported here, straight off the element class — the same type the
 * React package exports under the same name.
 */
export function generateRemoteSvelteComponentIndexFile(
  componentSpecifications: ComponentDoc[],
) {
  let indexFile = "";

  componentSpecifications.map((component) => {
    const name = remoteComponentBaseNameOf(component);
    const element = remoteComponentNameOf(component);

    indexFile += `export { default as ${name} } from "./${name}.svelte";`;
    indexFile += `export type { ${element}Props as ${name}Props } from "@mittwald/flow-remote-elements";`;
  });

  return indexFile;
}
