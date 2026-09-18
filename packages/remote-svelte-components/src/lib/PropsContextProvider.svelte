<script lang="ts">
  import type { Snippet } from "svelte";
  import { setPropsContext, type FlowPropsContext } from "./propsContext.js";

  /**
   * Declares props for the components below — Flow's `PropsContext`, as a
   * component.
   *
   * Renders no element of its own, so it adds nothing to the remote tree. A
   * composite puts it _inside_ the element it renders: a generated component
   * clears the props context for its own children, the way every Flow UI
   * component does, so a context set around one never reaches through it.
   */
  interface Props {
    /** Props per component name, e.g. `{ Button: { onPress } }`. */
    props: FlowPropsContext;
    children?: Snippet;
  }

  const { props: contextProps, children }: Props = $props();

  // A context is set once, while the component initializes — by design.
  // svelte-ignore state_referenced_locally
  setPropsContext(contextProps);
</script>

{@render children?.()}
