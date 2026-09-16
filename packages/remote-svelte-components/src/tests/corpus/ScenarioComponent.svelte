<script lang="ts">
  import type { Snippet } from "svelte";
  import * as components from "../../index.js";
  import RemoteScenario from "./RemoteScenario.svelte";
  import ScenarioTextComponent from "./ScenarioTextComponent.svelte";
  import { UnsupportedScenarioError, type ComponentNode } from "./scenarioNode.js";

  const { node }: { node: ComponentNode } = $props();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = (components as Record<string, any>)[node.name];

  if (!Component) {
    throw new UnsupportedScenarioError(
      node.name,
      "the Svelte package exports no component under that name",
    );
  }

  const slotNames = $derived(Object.keys(node.slots));

  /*
   * Text-only children are rendered as one interpolation rather than through a
   * block. Svelte marks a block with anchors — a comment and an empty text node
   * — and inside a remote element those are children the host counts, so
   * `Initials`, `Markdown` and `Truncate` (`extractTextFromFirstChild`, "exactly
   * one text child") would see three. An app writing `<Initials>Luke
   * Skywalker</Initials>` produces the single text node this reproduces.
   */
  const textChildren = $derived(
    node.children.length > 0 &&
      Object.keys(node.slots).length === 0 &&
      node.children.every((child) => child.kind === "text")
      ? node.children.map((child) => child.text).join("")
      : undefined,
  );

  /*
   * A snippet cannot be created from a name at runtime, so the slots below are
   * declared statically and handed out by position. Eight is one more than the
   * widest component in the generated surface (`ListItemViewContent`, six).
   */
  const slotPropsFor = (...snippets: Snippet[]): Record<string, Snippet> =>
    Object.fromEntries(
      slotNames.map((name, index) => [name, snippets[index] as Snippet]),
    );
</script>

{#snippet slot0()}<RemoteScenario nodes={node.slots[slotNames[0] ?? ""] ?? []} />{/snippet}
{#snippet slot1()}<RemoteScenario nodes={node.slots[slotNames[1] ?? ""] ?? []} />{/snippet}
{#snippet slot2()}<RemoteScenario nodes={node.slots[slotNames[2] ?? ""] ?? []} />{/snippet}
{#snippet slot3()}<RemoteScenario nodes={node.slots[slotNames[3] ?? ""] ?? []} />{/snippet}
{#snippet slot4()}<RemoteScenario nodes={node.slots[slotNames[4] ?? ""] ?? []} />{/snippet}
{#snippet slot5()}<RemoteScenario nodes={node.slots[slotNames[5] ?? ""] ?? []} />{/snippet}
{#snippet slot6()}<RemoteScenario nodes={node.slots[slotNames[6] ?? ""] ?? []} />{/snippet}
{#snippet slot7()}<RemoteScenario nodes={node.slots[slotNames[7] ?? ""] ?? []} />{/snippet}

<!--
  The branch is here rather than inside the element on purpose: a block's
  anchors land wherever the block is written, and inside a remote element they
  become children the host counts.
-->
{#if textChildren !== undefined}<ScenarioTextComponent
    name={node.name}
    props={node.props}
    text={textChildren}
  />{:else}<Component
    {...node.props}
    {...slotPropsFor(slot0, slot1, slot2, slot3, slot4, slot5, slot6, slot7)}
  ><RemoteScenario nodes={node.children} /></Component>{/if}
