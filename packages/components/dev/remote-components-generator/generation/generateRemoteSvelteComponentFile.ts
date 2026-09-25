import type { ComponentDoc } from "react-docgen-typescript";
import { checkTagIsSet } from "../lib/docTags";
import { isSlot } from "../lib/propClassifiers";
import { remoteComponentBaseNameOf } from "../lib/remoteComponentBaseNameOf";
import { remoteComponentNameOf } from "../lib/remoteComponentNameOf";
import { remoteElementTagNameOf } from "../lib/remoteElementTagNameOf";

const header = `\
<!-- prettier-ignore -->
<!-- This file is auto-generated with the remote-components-generator -->
`;

/**
 * The Svelte counterpart of `generateRemoteReactComponentFile`.
 *
 * Two things are written out that React's emitter does not need, and both are
 * about what Svelte puts _inside_ an element:
 *
 * - **The tag is written literally.** `<svelte:element this={tag}>` always
 *   inserts a text anchor into the element, remote-dom carries it across as a
 *   child, and a component that takes none then breaks on the host — `Image`
 *   renders an `<img>`, which React refuses to give children. A statically
 *   written `<flr-image />` has no children at all. The generator knows the
 *   tag, so it is the one place that can spell it out.
 * - **The two shapes are branched outside the element.** A block's anchors land
 *   where the block is written, so the choice between "with content" and
 *   "empty" is made in the parent's markup rather than inside the element.
 *
 * Everything else the wrapper needs — which keys are remote properties, which
 * are events — is on the element class at runtime (`remotePropertyDefinitions`,
 * `remoteEventDefinitions`) and read there by `useRemoteElementSync`, so unlike
 * React's files none of it is emitted.
 */
export function generateRemoteSvelteComponentFile(c: ComponentDoc) {
  const t = {
    element: remoteComponentNameOf(c),
    name: remoteComponentBaseNameOf(c),
    tag: remoteElementTagNameOf(c),
    slots: Object.keys(c.props)
      .sort()
      .filter((prop) => isSlot(c, prop)),
    /*
     * `@flr-provider`, carried over the same way the React emitter carries
     * `type: "provider"`: a provider must not clear the props context for its
     * children, or it drops the one set around it.
     */
    provider: checkTagIsSet(c.tags, "provider") ? ", isProvider: true" : "",
  };

  const slotNameType =
    t.slots.length > 0 ? `, ${t.slots.map((s) => `"${s}"`).join(" | ")}` : "";

  const destructured = ["children", ...t.slots].join(", ");

  const hasContent = ["children", ...t.slots]
    .map((name) => `${name} !== undefined`)
    .join(" ||\n      ");

  const slotImport =
    t.slots.length > 0
      ? `\n  import { slotAttribute } from "../lib/slotAttribute.js";`
      : "";

  /*
   * Written without whitespace between the parts: Svelte keeps a text node
   * wherever the source has whitespace between two nodes, and in a remote tree
   * that text node is mirrored to the host as a child of the component.
   */
  const slotMarkup = t.slots
    .map(
      (slot) =>
        `{#if ${slot}}<flr-slot-root-wrapper use:slotAttribute={"${slot}"}>{@render ${slot}()}</flr-slot-root-wrapper>{/if}`,
    )
    .join("");

  return `${header}<script lang="ts">
  import type { ${t.element}Props } from "@mittwald/flow-remote-elements";
  import { ${t.element} } from "@mittwald/flow-remote-elements";
  import { useRemoteElementSync } from "../lib/remoteElementSync.svelte.js";${slotImport}
  import type { FlowRemoteProps } from "../lib/types.js";

  let { ${destructured}, ...props }: FlowRemoteProps<${t.element}Props${slotNameType}> = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(
    { tag: "${t.tag}", name: "${t.name}", element: ${t.element}${t.provider} },
    () => props,
  );

  const hasContent = $derived(
    ${hasContent},
  );
</script>

{#if hasContent}<${t.tag} bind:this={element.node}>{@render children?.()}${slotMarkup}</${t.tag}>{:else}<${t.tag} bind:this={element.node}></${t.tag}>{/if}
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
