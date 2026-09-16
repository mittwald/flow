<script lang="ts">
  import type { Snippet } from "svelte";
  import { useRemoteElementSync } from "./remoteElementSync.svelte.js";
  import { slotAttribute } from "./slotAttribute.js";
  import type { FlowRemoteElementConfig } from "./types.js";

  /**
   * Wraps any `flr-*` element in a Svelte component — the escape hatch for an
   * element the generator does not cover.
   *
   * The generated components do **not** use this one. They write their tag
   * literally, because `<svelte:element this={tag}>` always inserts a text
   * anchor into the element and remote-dom carries it across as a child: a
   * component that takes no children then reaches the host with one, which
   * `Image` (an `<img>`) refuses outright. A generator knows its tag; this
   * component cannot.
   *
   * So the anchor is the price of being generic. It is harmless for anything
   * that takes children anyway, and the alternative — a literal tag — is
   * exactly what the generated files are for.
   */
  interface Props {
    __flr: FlowRemoteElementConfig;
    children?: Snippet;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any;
  }

  const { __flr, children, ...rest }: Props = $props();

  // svelte-ignore state_referenced_locally
  const element = useRemoteElementSync(__flr, () => rest);

  const slots = $derived(
    (__flr.slotNames ?? [])
      .map((slotName) => ({
        slotName,
        snippet: rest[slotName] as Snippet | undefined,
      }))
      .filter(
        (slot): slot is { slotName: string; snippet: Snippet } =>
          typeof slot.snippet === "function",
      ),
  );
</script>

<!--
  Written without whitespace between the parts on purpose: Svelte keeps a text
  node wherever the source has whitespace between two nodes, and in a remote
  tree that text node is mirrored to the host as a child of the component.
-->
<svelte:element
  this={__flr.tag}
  bind:this={element.node}
>{@render children?.()}{#each slots as slot (slot.slotName)}<flr-slot-root-wrapper
      use:slotAttribute={slot.slotName}
    >{@render slot.snippet()}</flr-slot-root-wrapper>{/each}</svelte:element>
