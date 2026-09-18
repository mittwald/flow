<script lang="ts">
  import * as components from "../../index.js";

  /**
   * A component whose children are nothing but text.
   *
   * Worth its own file because of what it does *not* contain: a block. Svelte
   * marks one with anchors — a comment and an empty text node — and inside a
   * remote element those are children the host counts. `Initials`, `Markdown`
   * and `Truncate` ask for exactly one text child
   * (`extractTextFromFirstChild`), so through a block they see three and give
   * up. A single interpolation is one text node, which is what an app writing
   * `<Initials>Luke Skywalker</Initials>` produces.
   */
  const {
    name,
    props,
    text,
  }: { name: string; props: Record<string, unknown>; text: string } = $props();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // svelte-ignore state_referenced_locally
  const Component = (components as Record<string, any>)[name];
</script>

<Component {...props}>{text}</Component>
